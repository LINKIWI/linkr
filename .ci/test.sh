#!/usr/bin/env bash

set -ex

# Python environment initialization
virtualenv env
source env/bin/activate
pip install -r requirements.txt

npm install
npm run lint
npm run build
npm run test
