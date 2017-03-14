# flake8: noqa: F401

import linkr

import views


out_file = 'frontend/static/dist/index.html'

with open(out_file, 'w') as html:
    contents = views.main.frontend().encode('utf-8')
    html.write(contents)
    print 'Compiled frontend template to {out_file} ({size} bytes)'.format(
        out_file=out_file,
        size=len(contents),
    )
