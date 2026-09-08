/*
 * pano-ar.js — client-side "View in AR" for panoramas.
 *
 * Builds an ARKit-compatible USDZ in the browser, on demand, from a panorama
 * JPEG the site already hosts (no stored duplicate assets). The pano is wrapped
 * onto a ~180° cylindrical arc (a curved screen you place in your room via AR
 * Quick Look) — the geometry ported from arpanos/usdexample2_working.py.
 *
 * A USDZ is just an *uncompressed*, 64-byte-aligned ZIP of a small ASCII .usda
 * plus the texture. We write that zip by hand so we control the alignment.
 */
(function (global) {
  'use strict';

  // ---------------------------------------------------------------- CRC-32
  var CRC_TABLE = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(bytes) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  // ------------------------------------------------------- curved-screen USDA
  // Returns ASCII USD for `aspect` (width/height). Units are meters.
  function buildUsda(aspect, opts) {
    opts = opts || {};
    // Wrap angle auto-derives from the image's aspect ratio (a wider pano captured
    // more of the world, so it wraps further around you), assuming a nominal vertical
    // field of view. Pass opts.arcDeg to override with a fixed wrap.
    var vFovDeg = opts.vFovDeg || 55;               // assumed vertical field of view (deg)
    var maxArcDeg = opts.maxArcDeg || 300;          // cap so it never self-overlaps / exceeds a full turn
    var arcDeg = (opts.arcDeg != null) ? opts.arcDeg : Math.min(vFovDeg * aspect, maxArcDeg);
    var arc = arcDeg * Math.PI / 180;               // horizontal wrap
    var height = opts.heightMeters || 0.8;          // pano height in meters (width + radius scale from this)
    var eye = (opts.eyeHeightMeters != null) ? opts.eyeHeightMeters : 1.4;       // vertical center of the floating pano
    var markerRadius = (opts.markerRadiusMeters != null) ? opts.markerRadiusMeters : 0.12; // floor disc radius (0 = off)
    var width = height * aspect;
    var radius = width / arc;
    var segments = 96;
    var yBot = eye - height / 2;
    var yTop = eye + height / 2;

    // ---- curved pano (floats at eye height; wraps concave toward the viewer) ----
    var points = [];
    var st = [];
    for (var i = 0; i <= segments; i++) {
      var a = -arc / 2 + (i / segments) * arc;
      var x = radius * Math.sin(a);
      // Negative cos: arc's middle sits away from the viewer, ends curve back
      // toward them (concave/wrap-around). Left/right depends only on x, no mirror.
      var z = -radius * Math.cos(a);
      points.push([x, yBot, z]);
      points.push([x, yTop, z]);
      var u = i / segments;
      st.push([u, 0]);
      st.push([u, 1]);
    }
    var faceCounts = [];
    var faceIdx = [];
    for (var s = 0; s < segments; s++) {
      var b = s * 2;
      faceCounts.push(4);
      faceIdx.push(b, b + 2, b + 3, b + 1);
    }

    function f(n) { return Math.abs(n) < 1e-6 ? '0' : (+n.toFixed(6)).toString(); }
    function v3(a) { return '(' + f(a[0]) + ', ' + f(a[1]) + ', ' + f(a[2]) + ')'; }
    function v2(a) { return '(' + f(a[0]) + ', ' + f(a[1]) + ')'; }
    function extentOf(pts) {
      var mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
      for (var j = 0; j < pts.length; j++) for (var k = 0; k < 3; k++) {
        if (pts[j][k] < mn[k]) mn[k] = pts[j][k];
        if (pts[j][k] > mx[k]) mx[k] = pts[j][k];
      }
      return v3(mn) + ', ' + v3(mx);
    }
    var ptsStr = points.map(v3).join(', ');
    var stStr = st.map(v2).join(', ');
    var extStr = extentOf(points);

    // ---- optional floor reference disc at the arc center (the "stand here" marker) ----
    // AR Quick Look rests the bounding-box bottom on the floor, so this flat disc
    // (at y=0) becomes the ground contact and lets the pano float at eye height above it.
    var markerMesh = '', markerMat = '';
    if (markerRadius > 0) {
      var segs = 48;
      var dp = [[0, 0, 0]]; // center vertex
      for (var d = 0; d < segs; d++) {
        var t = (d / segs) * Math.PI * 2;
        dp.push([markerRadius * Math.cos(t), 0, markerRadius * Math.sin(t)]);
      }
      var dCounts = [], dIdx = [];
      for (var d2 = 0; d2 < segs; d2++) {
        dCounts.push(3);
        dIdx.push(0, 1 + d2, 1 + ((d2 + 1) % segs)); // triangle fan
      }
      markerMesh =
        '\n    def Mesh "marker"\n    {\n' +
        '        uniform token subdivisionScheme = "none"\n' +
        '        bool doubleSided = 1\n' +
        '        float3[] extent = [' + extentOf(dp) + ']\n' +
        '        int[] faceVertexCounts = [' + dCounts.join(', ') + ']\n' +
        '        int[] faceVertexIndices = [' + dIdx.join(', ') + ']\n' +
        '        point3f[] points = [' + dp.map(v3).join(', ') + ']\n' +
        '        rel material:binding = </PanoRoot/MarkerMat>\n' +
        '    }\n';
      markerMat =
        '\n    def Material "MarkerMat"\n    {\n' +
        '        token outputs:surface.connect = </PanoRoot/MarkerMat/S.outputs:surface>\n' +
        '        def Shader "S"\n        {\n' +
        '            uniform token info:id = "UsdPreviewSurface"\n' +
        '            color3f inputs:diffuseColor = (0.05, 0.75, 0.85)\n' +
        '            color3f inputs:emissiveColor = (0.02, 0.28, 0.32)\n' +
        '            float inputs:roughness = 0.6\n' +
        '            float inputs:metallic = 0\n' +
        '            token outputs:surface\n' +
        '        }\n' +
        '    }\n';
    }

    return '#usda 1.0\n' +
      '(\n' +
      '    defaultPrim = "PanoRoot"\n' +
      '    metersPerUnit = 1\n' +
      '    upAxis = "Y"\n' +
      ')\n\n' +
      'def Xform "PanoRoot" (kind = "component")\n{\n' +
      '    def Mesh "card"\n    {\n' +
      '        uniform token subdivisionScheme = "none"\n' +
      '        bool doubleSided = 1\n' +
      '        float3[] extent = [' + extStr + ']\n' +
      '        int[] faceVertexCounts = [' + faceCounts.join(', ') + ']\n' +
      '        int[] faceVertexIndices = [' + faceIdx.join(', ') + ']\n' +
      '        point3f[] points = [' + ptsStr + ']\n' +
      '        texCoord2f[] primvars:st = [' + stStr + '] (\n            interpolation = "vertex"\n        )\n' +
      '        rel material:binding = </PanoRoot/PanoMat>\n' +
      '    }\n' +
      markerMesh + '\n' +
      '    def Material "PanoMat"\n    {\n' +
      '        token inputs:frame:stPrimvarName = "st"\n' +
      '        token outputs:surface.connect = </PanoRoot/PanoMat/PBRShader.outputs:surface>\n\n' +
      '        def Shader "PBRShader"\n        {\n' +
      '            uniform token info:id = "UsdPreviewSurface"\n' +
      '            color3f inputs:diffuseColor.connect = </PanoRoot/PanoMat/diffuseTexture.outputs:rgb>\n' +
      '            float inputs:metallic = 0\n' +
      '            float inputs:roughness = 0.9\n' +
      '            token outputs:surface\n' +
      '        }\n\n' +
      '        def Shader "stReader"\n        {\n' +
      '            uniform token info:id = "UsdPrimvarReader_float2"\n' +
      '            token inputs:varname.connect = </PanoRoot/PanoMat.inputs:frame:stPrimvarName>\n' +
      '            float2 outputs:result\n' +
      '        }\n\n' +
      '        def Shader "diffuseTexture"\n        {\n' +
      '            uniform token info:id = "UsdUVTexture"\n' +
      '            asset inputs:file = @texture.jpg@\n' +
      '            float2 inputs:st.connect = </PanoRoot/PanoMat/stReader.outputs:result>\n' +
      '            token inputs:wrapS = "clamp"\n' +
      '            token inputs:wrapT = "clamp"\n' +
      '            float3 outputs:rgb\n' +
      '        }\n' +
      '    }\n' +
      markerMat +
      '}\n';
  }

  // --------------------------------------------------------- USDZ zip packer
  // Two entries: model.usda (root, first) then texture.jpg, stored uncompressed,
  // with the JPEG's data on a 64-byte boundary (padded via trailing usda space).
  function packUsdz(usdaStr, jpegBytes) {
    var enc = new TextEncoder();
    var NAME_USDA = 'model.usda';   // 10 bytes
    var NAME_TEX = 'texture.jpg';   // 11 bytes
    var nameUsda = enc.encode(NAME_USDA);
    var nameTex = enc.encode(NAME_TEX);
    var usdaBytes = enc.encode(usdaStr);

    // tex data offset = 30 + 10 + Lusda + 30 + 11 = 81 + Lusda ; pad usda to align to 64
    var ALIGN = 64;
    var texDataOff = 30 + NAME_USDA.length + usdaBytes.length + 30 + NAME_TEX.length;
    var pad = (ALIGN - (texDataOff % ALIGN)) % ALIGN;
    if (pad > 0) {
      var padded = new Uint8Array(usdaBytes.length + pad);
      padded.set(usdaBytes, 0);
      padded.fill(0x20, usdaBytes.length); // trailing spaces are harmless in usda
      usdaBytes = padded;
    }

    var crcUsda = crc32(usdaBytes);
    var crcTex = crc32(jpegBytes);

    var chunks = [];
    var central = [];
    var offset = 0;

    function u16(v) { return new Uint8Array([v & 255, (v >>> 8) & 255]); }
    function u32(v) { return new Uint8Array([v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]); }
    function push(arr) { for (var i = 0; i < arr.length; i++) { chunks.push(arr[i]); offset += arr[i].length; } }

    function writeEntry(nameBytes, data, crc) {
      var localOffset = offset;
      push([
        u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0),
        u32(crc), u32(data.length), u32(data.length),
        u16(nameBytes.length), u16(0), nameBytes, data
      ]);
      central.push([
        u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0),
        u32(crc), u32(data.length), u32(data.length),
        u16(nameBytes.length), u16(0), u16(0), u16(0), u16(0),
        u32(0), u32(localOffset), nameBytes
      ]);
    }

    writeEntry(nameUsda, usdaBytes, crcUsda);
    writeEntry(nameTex, jpegBytes, crcTex);

    var cdStart = offset;
    var cdSize = 0;
    for (var i = 0; i < central.length; i++) {
      var before = offset;
      push(central[i]);
      cdSize += offset - before;
    }
    push([
      u32(0x06054b50), u16(0), u16(0),
      u16(central.length), u16(central.length),
      u32(cdSize), u32(cdStart), u16(0)
    ]);

    return new Blob(chunks, { type: 'model/vnd.usdz+zip' });
  }

  async function buildUsdzBlobFromImage(imageUrl, opts) {
    opts = opts || {};
    var maxWidth = opts.maxTextureWidth || 4096;
    var tex = await prepareTexture(imageUrl, maxWidth);
    return packUsdz(buildUsda(tex.aspect, opts), tex.bytes);
  }

  // Returns { bytes, aspect } for the AR texture. Uses the source image as-is
  // when it's within maxWidth (no re-compression), otherwise downscales via a
  // canvas so mobile memory / file size stay sane. Never upscales.
  async function prepareTexture(imageUrl, maxWidth) {
    var img = await loadImage(imageUrl);
    var w = img.naturalWidth, h = img.naturalHeight, aspect = w / h;
    if (w <= maxWidth) {
      var buf = await fetch(imageUrl).then(function (r) {
        if (!r.ok) throw new Error('image fetch failed: ' + r.status);
        return r.arrayBuffer();
      });
      return { bytes: new Uint8Array(buf), aspect: aspect };
    }
    var tw = maxWidth, th = Math.round(maxWidth / aspect);
    var canvas = document.createElement('canvas');
    canvas.width = tw; canvas.height = th;
    canvas.getContext('2d').drawImage(img, 0, 0, tw, th);
    var blob = await new Promise(function (res) { canvas.toBlob(res, 'image/jpeg', 0.9); });
    var abuf = await blob.arrayBuffer();
    return { bytes: new Uint8Array(abuf), aspect: aspect };
  }

  function loadImage(url) {
    return new Promise(function (res, rej) {
      var img = new Image();
      img.onload = function () { res(img); };
      img.onerror = function () { rej(new Error('image decode failed')); };
      img.src = url;
    });
  }

  // ------------------------------------------------------------- DOM binding
  var supported = (function () {
    if (typeof document === 'undefined') return false;
    var a = document.createElement('a');
    return !!(a.relList && a.relList.supports && a.relList.supports('ar'));
  })();

  // AR Quick Look shows an optional bottom banner built from URL-fragment params; we
  // use it for brief placement instructions. Override per-call via opts.arTitle / arSubtitle.
  var AR_TITLE = 'Place the panorama';
  var AR_SUBTITLE = 'Aim your phone at the floor and tap, then stand on the dot';

  // Wire a visible button to launch AR Quick Look for `imageUrl`. The USDZ is
  // pre-built on first hover/touch so the tap itself is a plain navigation to a
  // ready blob URL (what iOS wants for the AR launch).
  function attach(btn, imageUrl, opts) {
    if (!supported) { btn.style.display = 'none'; return; }

    var blobUrl = null;
    var building = null;

    function prime() {
      if (blobUrl) return Promise.resolve(blobUrl);
      if (building) return building;
      building = buildUsdzBlobFromImage(imageUrl, opts).then(function (blob) {
        blobUrl = URL.createObjectURL(blob);
        return blobUrl;
      }).catch(function (err) { building = null; throw err; });
      return building;
    }

    // AR Quick Look expects the rel="ar" anchor to contain a single child element.
    var anchor = document.createElement('a');
    anchor.setAttribute('rel', 'ar');
    anchor.style.display = 'none';
    anchor.appendChild(document.createElement('img'));
    document.body.appendChild(anchor);

    // Append placement instructions as AR Quick Look banner params (fragment on the href).
    function arHref(url) {
      var title = (opts && opts.arTitle != null) ? opts.arTitle : AR_TITLE;
      var sub = (opts && opts.arSubtitle != null) ? opts.arSubtitle : AR_SUBTITLE;
      var parts = [];
      if (title) parts.push('checkoutTitle=' + encodeURIComponent(title));
      if (sub) parts.push('checkoutSubtitle=' + encodeURIComponent(sub));
      return parts.length ? url + '#' + parts.join('&') : url;
    }

    btn.addEventListener('pointerenter', function () { prime().catch(function () {}); }, { passive: true });
    btn.addEventListener('pointerdown', function () { prime().catch(function () {}); }, { passive: true });

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (blobUrl) { anchor.href = arHref(blobUrl); anchor.click(); return; }
      btn.classList.add('is-loading');
      prime().then(function (url) {
        anchor.href = arHref(url);
        anchor.click(); // may need a second tap on strict iOS; then blobUrl is ready
      }).catch(function (err) {
        console.error('[pano-ar]', err);
        alert('Sorry — could not prepare the AR view.');
      }).finally(function () { btn.classList.remove('is-loading'); });
    });
  }

  var api = {
    supported: supported,
    attach: attach,
    buildUsdzBlobFromImage: buildUsdzBlobFromImage,
    _buildUsda: buildUsda,
    _packUsdz: packUsdz,
    _crc32: crc32
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.PanoAR = api;
})(typeof window !== 'undefined' ? window : this);
