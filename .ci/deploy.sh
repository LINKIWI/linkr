#!/usr/bin/env bash

set -ex

cd ${REPO_DIR}

# Git
git fetch --all
git checkout ${BRANCH}
git reset --hard origin/${BRANCH}

# Python virtual environment
source env/bin/activate

# Install step
pip install -r requirements.txt
npm install

# Build SCSS and Javascript module bundle
npm run build

# Reload Apache config
sudo service apache2 reload

allu \
    --skip-auth \
    --type text \
    --tag Jenkins \
    --message "Successfully deployed linkr ("$(git rev-parse --abbrev-ref HEAD)", "$(git sha)")."
