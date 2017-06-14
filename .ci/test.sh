#!/usr/bin/env bash

set -ex

# Python environment initialization
virtualenv env
source env/bin/activate

# Application config
cp config/options/client.json.template config/options/client.json
cp config/options/server.json.template config/options/server.json
cp config/secrets/client.json.template config/secrets/client.json
cp config/secrets/server.json.template config/secrets/server.json

# Database initialization
service mysql start
mysql -u root < .ci/db-init.sql

# Install step
pip install -r requirements.txt
npm-s3 install

# Frontend tests
npm run lint
npm run build
npm run cover
