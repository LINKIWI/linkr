#!/usr/bin/env bash

set -ex

# Python environment initialization
virtualenv env
source env/bin/activate

# Install step
pip install -r requirements.txt
gem install sass
npm install

# Frontend tests
npm run lint
npm run build
npm run cover
