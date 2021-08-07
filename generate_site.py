import os
import jinja2


def main():
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
            result_file.write(jinja_template.render(name=template_file.name.replace(".html", "")))


if __name__ == '__main__':
    main()


