#!/usr/bin/env bash

set -ex

# Python environment initialization
virtualenv env
source env/bin/activate

# Application config
cp config/options.py.template config/options.py

# Database initialization
service mysql start
mysql -u root < .ci/db-init.sql

# Install step
pip install -r requirements.txt
npm-s3 install

# Frontend tests
npm run lint-backend
npm run lint-frontend
npm run build
npm run cover-backend
npm run cover-frontend
