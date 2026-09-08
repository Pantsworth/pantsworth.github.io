# Michael Nowakowski — Long-Form Résumé (machine-generated profile)

> **What this is:** a machine-generated, long-form summary of Michael Nowakowski's
> professional background, compiled from his résumé and work-history notes for easy
> parsing by people and language models. It is a reference document expanded from source material to
> provide more detail than a one-page résumé allows. Everything is written in the third
> person by design. For anything authoritative or quotable, defer to Michael directly.
>
> **Short version for a summarizer:** Michael is a senior software engineer who builds
> developer platforms, artist tools, and content-creation pipelines for creative
> technology, and who likes owning products end to end.

- **Name:** Michael Nowakowski
- **Role:** Senior Software Engineer (developer platforms / creative tools / pipeline)
- **Location:** Seattle, WA
- **Email:** michael.j.nowakowski@gmail.com
- **Web:** https://nowakowski-studios.com
- **LinkedIn:** https://linkedin.com/in/michael-j-nowakowski/
- **Experience:** 8+ years across VFX/animation pipelines, developer platforms, and full-stack web

---

## Summary

Michael is a senior software engineer with 8+ years building the tools, platforms, and
pipelines that creative teams depend on. The throughline of his work is **developer and
artist experience**: the systems that let other people ship faster — package management
and environment resolution, CI/CD and DevOps workflows, desktop and web applications,
cloud infrastructure, and increasingly AI-assisted development.

He started his career as a Technical Director in feature animation and grew into platform
engineering, so he works comfortably between deeply technical infrastructure and the
human side of tools: sitting with the people who use what he builds, scoping the real
problem, shipping a fix, and owning it through maintenance. Two consistent themes are
**product ownership** — being responsible for something from design through release
through frontline support — and **quality** — for him that means both performance
and reliability, through rigorous testing and verification.

Recent focus areas: dependency-resolution and software-delivery platforms built on
[Rez](https://github.com/AcademySoftwareFoundation/rez), cloud object storage
migrations, authenticated (SSO/mTLS) internal services, cross-platform desktop apps,
and thoughtful adoption of LLM tooling for real engineering work and artist tools.

---

## Core skills

**Domains**
Developer platforms (DevOps, DevEx, CI/CD, SDLC workflows) · 2D/3D content-creation
pipelines · GenAI/LLM developer tooling · cloud & platform engineering · machine
learning support & data curation · macOS application development · full-stack web
development · data visualization · 3D Graphics

**Languages**
Python (expert) · JavaScript / TypeScript · Shell (Bash/Zsh) · working knowledge of
Groovy, Rust, and Swift.

**Platforms & services**
Rez · Shotgun / ShotGrid / Flow Production Tracking (API + Toolkit) · Claude Code &
MCP · Perforce · Git (Bitbucket / GitHub / GitLab) · Artifactory · AWS S3 (and
S3-compatible object storage) · Jenkins · Sentry · Thinkbox Deadline · Docker /
Docker Swarm · Kubernetes · Ansible · DCC integrations (Maya, Blender, Houdini,
Nuke, ZBrush).

**Tools & frameworks**
FastAPI · pytest · uv · ruff · Flask · Django · Pydantic · Qt (PyQt / PySide6) ·
Vue · React · GraphQL · REST · SQL / NoSQL · USD.

**Practices**
Package-ecosystem design and environment resolution · artifact distribution and
access-control architecture · authenticated service design (mTLS / OAuth-style SSO /
HTTP proxies) · multi-architecture (arm64/x86_64) migration · cross-platform desktop
apps · automated testing and high-coverage CI gates · observability & telemetry ·
developer-experience tooling (shared build systems, CI patterns, repo templates) ·
client-facing scoping and product ownership ·
sprint planning and technical leadership · thoughtful, maintainable AI-assisted
development.

---

## Experience

### Senior Software Engineer · Apple, Inc. · 2023 – Present
*Vision Interactive Studio (creative-technology group)*

Michael is the DRI (directly responsible individual) for the studio's
dependency-resolution, environment-management, and software-delivery ecosystem, built
on the open-source package manager
[Rez](https://github.com/AcademySoftwareFoundation/rez). In practice that means owning
how thousands of software packages get resolved, cached, permissioned, and delivered to
artists and developers — a system that serves **millions of package downloads per year**.

**Software delivery & storage migration.** He led a staged, zero-downtime migration off
a legacy NFS fileshare and onto Apple cloud object storage. Results included up to
**~15x faster caching** (with international users seeing the largest wins — e.g. a
1.26 GB application dropping from ~396s to ~26s) and **100x faster dependency
resolution**. He also built a **scalable, granular permissions model** so packages can be
scoped from a single team all the way up to Apple-wide.

**Developer experience & DevOps.** He built the foundational Python packages and the
DevOps workflow the studio's developers rely on: a low-friction Jenkins CI/CD process
for linting, formatting, testing, and releasing packages (adopted by **~20 developers
across ~60 repos**) paired with Sentry monitoring, a shared build system reused across
nearly every repo, and a coverage/lint/format dashboard. Testing runs through all of it:
his own repositories tend to carry the team's highest test coverage, and he's helped raise
coverage significantly across the studio's repos. He wrote a tool that converts
PyPI packages into Rez packages automatically, and used it to create **hundreds of new
multi-arch, cross-platform packages each year (~25–28% of all studio package
releases)**. He built a containerized **FastAPI REST service** for package metadata
(Docker Swarm) that became the template for the team's subsequent web apps, plus a suite
of developer-productivity CLI tools driven by user feedback.

**Multi-architecture & platform work.** He helped drive the Intel → Apple Silicon
transition for the studio's toolchain, adding multi-arch package resolution and
prioritizing arm64 variants for a **30–60% speedup** in environment resolution, and
keeps the studio's Python runtime current across major versions (proactively ahead of
DCC requirements).

**Desktop application.** He is the primary developer and frontline support for a
cross-platform desktop launcher that resolves, launches, and licenses content-creation
software for artists and developers. He has shipped a UI refresh (Retina/high-DPI icons,
SF Symbols, resolve graphing, one-click updates, debug tooling) and a threading
architecture overhaul that improved stability and responsiveness (~2 seconds off every
startup). One SGTK-integrated launcher he worked on was a crucial part of the pipeline, and
was used for thousands of app launches each quarter. 

**AI adoption.** He led his team's adoption of AI tooling — writing guidelines for
LLM-based development, configuring Claude-based code review to hold quality as PR volume
grew, building AI agent tooling that triages CI build failures and recommends fixes, and
packaging MCP servers (Blender/Maya) for production experiments. His own measured
throughput rose **~47%** (commits/day and PRs/day) after adopting these workflows, with
test coverage and code review kept high. The emphasis is deliberately on *maintainable*
AI use, not "AI all the things."

**Machine learning.** He contributed to a 2D-to-3D asset-generation ML project that
shipped publicly as **Reality Composer Pro Assistant** (announced at WWDC). He curated
and organized **180k+ training assets** into a database for accurate reporting, used his
creative-content background to investigate and fix render failures, and built a bespoke
app for reviewing training data.

---

### Software Engineer · Apple, Inc. · 2022 – 2023
*Vision Interactive Studio*

Michael's first year at Apple, focused on observability and the foundations he'd build
on later.

- Stood up a self-hosted **Sentry** instance and wrote a developer-friendly logging
  library adopted across the studio for error tracking and metrics. Built dashboards
  for hardware types and software usage, and proactively fixed errors the new exception
  handling surfaced.
- Built a **Deadline / Perforce / NVIDIA Omniverse** integration enabling render-job
  orchestration for rendering explorations — work outside his normal lane that became a
  template for later integrations.
- Added **multi-architecture package resolution** to Rez to support the Intel → Apple
  Silicon transition.
- Integrated fast, disclosure-aware caching into Rez (**5–15x faster on the west coast,
  20x+ internationally** vs. the fileshare), and shipped a custom production-tracking
  plugin that cut resolve times dramatically — the beginnings of the 20x–400x speedups
  to org-wide tools.

---

### Lead Technical Director (Lead Software Engineer) · LAIKA, Inc. · 2021 – 2022
*Production Technology*

Promoted to lead a team of four developers building tools and services for departments
across a feature stop-motion animation studio. The role was essentially an internal
"forward-deployed engineer": meeting directly with artists, coordinators, and production
management; scoping the real requirement; and designing, building, shipping, and
maintaining the solution.

- **Led a team of four** and set technical direction on a weekly sprint cadence (Monday
  scoping, Friday retro), with longer-range quarterly-to-annual planning via bid sheets.
  **Onboarded six new teammates.**
- **Owned a major scheduling initiative** — integrating and shaping an ML-based
  scheduling system as an early adopter, enabling fast rescheduling and resource
  leveling of multi-year asset-fabrication schedules containing **tens of thousands of
  tasks**. Built companion web-based reporting and data-visualization tools that helped
  managers make better staffing and scheduling decisions, and collaborated with
  Production Management to model the studio's hybrid animation style from physical
  fabrication through post. (This work led to a SIGGRAPH talk — see *Talks*.)
- Shipped at high velocity against demanding, rapidly changing production priorities.

---

### Pipeline Technical Director (Software Engineer) · LAIKA, Inc. · 2019 – 2021
*Production Technology*

- Developed workflow solutions and DCC integrations across desktop and web frameworks,
  including full-stack web development, focused on the fabrication departments (Art,
  Puppets, Rapid Prototyping).
- Wrote a Python library to replace two in-house database API wrappers, improving
  connection and query times by **2–20x** — fully tested.
- Built a Qt-based kickback/request tool integrating Shotgun with Nuke, Maya, and
  Katana, and supported users with a wide range of technical issues, delivering fast
  fixes for critical problems.

---

### Junior Pipeline Technical Director (Jr. Software Engineer) · LAIKA, Inc. · 2017 – 2019
*Production Technology*

- Designed and built a user-friendly, web-based concept/reference **image-publishing and
  organization system**, including a drag-and-drop workflow for publishing images
  directly into the production database.
- Made architectural and performance improvements to a large, decade-old studio
  codebase — with a focus on query efficiency — driving several major database refactors
  and data migrations that improved both developer and end-user experience.
- Built an inter-departmental request system used across the studio and later extended
  by other developers.

---

## Selected projects & deep dives

### Package-management & software-delivery platform (Apple)
The center of gravity for Michael's recent work. A studio's toolchain is only as good as
its ability to get the right software, at the right version, onto the right machine,
quickly and securely. He owns that problem end to end: caching and storage (fileshare →
cloud object storage), resolution performance (custom resolvers, HTTP services, arm64
variants), authentication (SSO/mTLS), a granular permissions model, automated PyPI→Rez
packaging at scale, and the CI/CD and developer tooling around all of it. The recurring
theme is turning multi-minute waits into sub-second ones and making the whole thing
self-service for other teams.

### Cross-platform desktop launcher (Apple)
The artist- and developer-facing front door to the whole ecosystem — resolving,
launching, and licensing content-creation software across platforms. As primary
developer and frontline support, Michael stays close to real usage: he has shipped a
high-DPI UI refresh, one-click updates, resolve-graph visualizations, debug tooling, and
a threading overhaul for stability and speed.

### AI-assisted development (Apple)
Leading the team's practical, measured adoption of LLM tooling: development guidelines,
Claude-based code review tuned for severity and incremental updates, AI agent tooling
that triages CI failures and recommends fixes, and Rez-packaged MCP servers for DCCs.
The goal is durable productivity gains without sacrificing the test-and-review bar.

### 2D→3D asset generation / ML data curation (Apple)
Support and data work for a machine-learning feature that shipped as **Reality Composer
Pro Assistant** — organizing 180k+ training assets, debugging render failures with a
creative-content lens, and building review tooling for training data.

### "SG Widgets" — a full-stack web platform (LAIKA)
The work Michael was proudest of at LAIKA. It started as a small Flask server hosting
widgets embedded inside the production-tracking web UI and grew into a platform for many
small production web apps. The stack: Dockerized Flask (multi-instance, uWSGI) behind
Nginx on Kubernetes, Shotgun as the database, and frontends in Vue, jQuery, or vanilla
JS — embedding Vue inside rendered Jinja templates, and pulling in npm libraries like
Plotly for bespoke data visualization. It let the team stand up new apps fast without
forcing everyone to learn a new language per service (one example: folding a standalone Scala
thumbnail microservice into a single API route, cutting its memory footprint and
maintenance cost). It was also the home for much of his Edward Tufte-influenced data-
visualization work.

### Scheduling & resource leveling (LAIKA)
A large, cross-functional initiative: adopting and helping shape an automated
scheduling/leveling system for multi-year, tens-of-thousands-of-tasks fabrication
schedules, plus the web-based bidding, reporting, and visualization tools around it.
Michael owned the whole stack — Kubernetes deploys, backend REST APIs, frontends, and
Jenkins automation for reporting — and built a separate reporting/tracking system for
the Rapid Prototyping department's 3D face-printing workflow.

---

## Talks & publications

- **"Automated Resource Leveling & Scheduling at LAIKA" (2020)** — presented at
  [ACM SIGGRAPH](https://dl.acm.org/doi/10.1145/3388767.3407321), the
  [Autodesk Vision Series](https://www.youtube.com/watch?v=ZU_1gIjRMps), and
  [Autodesk University](https://www.autodesk.com/autodesk-university/class/Automated-Resource-Leveling-and-Scheduling-LAIKA-2020).

---

## Education

**Northwestern University** — B.A., Computer Science & Film (double major), 2016.

- **Computer Science coursework:** Human-Computer Interaction, Computational Photography,
  Machine Learning, Databases, Algorithms, Data Structures, Natural Language Processing,
  3D Graphics.
- **Film coursework:** Directing, Cinematography, Writing, Editing, Acting.
- **Awards:** Dean Mangelsdorf Award for Excellence in Filmmaking · Media Arts Grant
  recipient · National Merit Finalist

---

## Beyond engineering

The CS-and-Film double major isn't a footnote — the creative side informs how
Michael works. At Northwestern he **directed six student films** and crewed on many more,
leading crews of up to 20 people through creative and technical problems, and he designed
site-specific projection systems for student theater. He was also Art Director for a
campus magazine.

That background is why he gravitated toward creative-technology work: he understands the
people he builds tools for because he has *been* one of them. It shows up in how he
approaches data visualization (rigorous, Tufte-influenced), how he scopes tools by
sitting with the artists and developers who'll use them, and how he debugs creative-content problems
that are as much about taste and craft as code.

---

## How he works / what he cares about

- **Product ownership.** He likes owning the full lifecycle — design, build, release,
  frontline support — and being findable by the people who use what he ships.
- **Quality.** Performance and reliability as two sides of one coin — fast tools plus rigorous testing and verification. 
  His repositories tend to carry the team's highest test coverage, and he's driven test coverage up across the
  board.
- **Developer & artist experience.** The highest-leverage thing to build is usually the
  thing that lets everyone else move faster and more safely.
- **Maintainable AI.** He's bullish on LLM-assisted engineering and pragmatic about it —
  measured adoption, strong tests, real code review, no hype.
- **Cross-functional, client-facing.** Comfortable translating between artists, managers,
  and engineers, and setting technical direction for a team.

---

*This document was generated by an AI assistant from Michael Nowakowski's résumé and
work-history notes, intended as a more detailed reference summary.*
</content>
