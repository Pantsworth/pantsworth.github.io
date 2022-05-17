import os
import jinja2
import os
import shutil
from PIL import Image

thumb_suffix = "_thumb"

def main():
    # handle image compression
    img_files = []
    input_dir = "./img/flickr"
    output_dir = "./img/flickr_optimized"


    paths = ['./img/flickr']
    while (paths):
        search_path = paths.pop()
        for path in os.scandir(search_path):
            if path.is_dir():
                paths.append(path.path)
            else:
                if ".ds_store" in path.path.lower():
                    continue
                input_file_path = path.path
                output_file_path = input_file_path.replace(input_dir, output_dir)
                if not os.path.exists(output_file_path):
                    print(f"Creating file: {output_file_path}")
                    try:
                        os.makedirs(os.path.dirname(output_file_path))
                    except:
                        pass
                    
                    if input_file_path.endswith(".gif"):
                        shutil.copy2(input_file_path, output_file_path)
                        continue

                    input_image = Image.open(input_file_path)
                    input_image.thumbnail((3000,3000))
                    input_image.save(output_file_path, optimize=True, quality=75)
                    input_image.thumbnail((600,600))
                    input_image.save(
                        output_file_path.replace(
                            os.path.basename(output_file_path).rsplit(".")[0],
                             os.path.basename(output_file_path).rsplit(".")[0] + thumb_suffix
                        )
                    )

    # render templates
    template_dir = os.path.join(os.path.dirname(__file__), 'templates')
    jinja_env = jinja2.Environment(
        loader=jinja2.FileSystemLoader(template_dir),
        autoescape=True
    )
    for template_file in os.scandir("templates/"):
        if template_file.name == "base.html":
            continue

        jinja_template = jinja_env.get_template(template_file.name)
        with open(template_file.name, 'w') as result_file:
            album_config = {
                'Places': {"dir": "./img/flickr_optimized/still/places", "images": []},
                'Illustrative': {"dir": "./img/flickr_optimized/still/illustrative", "images": []},
                'Portraits':{"dir": "./img/flickr_optimized/still/portraits", "images": []},
                # 'Experiments':{"dir": "./img/flickr_optimized/still/experiments", "images": []},
                'Performances':{"dir": "./img/flickr_optimized/still/performances", "images": []},
            }

            for config in album_config:
                album_config[config]["images"] = get_image_paths(album_config[config]["dir"])

            if template_file.name == 'still.html':
                result_file.write(
                    jinja_template.render(
                        name=template_file.name.replace(".html", ""),
                        album_config=album_config,
                    )
                )
            elif template_file.name == 'index.html':
                result_file.write(
                    jinja_template.render(
                        name=template_file.name.replace(".html", ""),
                        images=get_image_paths("./img/flickr_optimized/index") + album_config['Places']['images'] + album_config['Performances']['images'],
                    )
                )


            else:
                result_file.write(jinja_template.render(name=template_file.name.replace(".html", "")))


def get_image_paths(dir_path):
    return [x.path for x in os.scandir(dir_path) if (thumb_suffix not in x.path) and not os.path.basename(x.path).startswith(".")]

if __name__ == '__main__':
    main()


