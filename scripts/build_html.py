import linkr  # flake8: noqa: F401

import views

OUT_FILE = 'frontend/static/dist/index.html'


def render_html():
    with open(OUT_FILE, 'w') as html:
        contents = views.main.frontend().encode('utf-8')
        html.write(contents)
        print 'Compiled frontend template to {out_file} ({size} bytes)'.format(
            out_file=OUT_FILE,
            size=len(contents),
        )


if __name__ == '__main__':
    render_html()
