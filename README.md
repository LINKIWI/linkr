<img alt="Linkr logo" src="https://cdn.rawgit.com/LINKIWI/linkr/a4853551/frontend/static/img/favicon.png" width="96px" height="96px" align="right" />

# linkr

Linkr is a self-hosted URL shortener built on modern web technologies that is fast, minimalistic, and developer-friendly.

## Demo

TODO

## Overview and Features

* Minimalistic, modern, and responsive frontend interface for both mobile and desktop web
* Support for administrator users and a dedicated admin interface to manage all links
* Statistics tracking for each created link
* Password-protected links
* Low-friction user accounts support
* Developer-friendly RESTful API, making it easy to build apps that leverage Linkr's services
* Linkr is *fast*.
  * Web UI is built with React and React-Router, meaning page-to-page navigation is instantaneous and *only one* network request for an HTML document is ever made per session
  * The entire client-side SPA requires only a *single* HTTP request totaling < 300 KB in size (production build, minified and gzipped)

## Installation

#### Prerequisites

* You need Python, `pip`, and the `virtualenv` package. ([Reference](https://virtualenv.pypa.io/en/stable/))
* You need Node and `npm`. ([Reference](https://nodejs.org/en/))
* You need a MySQL database. ([Reference](https://dev.mysql.com/doc/))
* All following instructions assume Linux.

#### Instructions

You need to get the code, install necessary dependencies, and build all frontend resources.

```bash
# The 'getting the code' part
$ git clone https://github.com/LINKIWI/linkr.git
$ cd linkr/
# The installation part
$ virtualenv env
$ source env/bin/activate
$ pip install -r requirements.txt
$ npm install
# The building part
$ NODE_ENV=production npm run build
# (Optional) Run all unit tests to make sure everything works.
$ npm run test-backend
$ npm run test-frontend
```

Next, set up the MySQL database.

```sql
CREATE USER 'linkr'@'localhost' IDENTIFIED BY 'super-secret-password';
CREATE DATABASE linkr;
GRANT ALL ON linkr.* TO 'linkr'@'localhost';
FLUSH PRIVILEGES;
```

Next, copy `config/options.py.template` to `config/options.py` and modify it to your liking. Most importantly, you'll need to set `DATABASE_PASSWORD` to the password you created above for the `linkr` database user.

Finally, run the `linkr_setup.py` script to walk you through setting up the database and creating an admin user.

```bash
$ python linkr_setup.py
==========LINKR SETUP==========

This script is used for initializing Linkr for the first time on a new deployment.
This will create the Linkr MySQL tables and create an admin user account.
Please ensure you have created the MySQL user and database BEFORE running this script.
Please ensure that you have copied config/options.py.template into config/options.py and set all config options to your liking.
It is especially important that all database configuration constants are set properly (host, name, username, password).
Press any key to continue or ^C to quit.

Configuration read successfully!
Linkr URL: https://linkr.example.com
Database host: localhost
Database name: linkr
Database username: linkr
Database password: super-secret-password

Press any key to create the Linkr database and tables.

Enter the username and password for the admin user.
Admin username: admin
Admin password:
Verify admin password:
Setup complete!
```
