# flake8: noqa: F401

import linkr

import views


with open('frontend/static/dist/index.html', 'w') as html:
    contents = views.main.frontend().encode('utf-8')
    html.write(contents)
