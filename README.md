<img alt="Linkr logo" src="https://cdn.rawgit.com/LINKIWI/linkr/a4853551/frontend/static/img/favicon.png" width="96px" height="96px" align="right" />

# linkr

Linkr is a self-hosted URL shortener built on modern web technologies that is fast, minimalistic, and developer-friendly.

## Demo

[Live demo](https://demo.linkrapp.com)

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
* You need a MySQL database. ([Reference](https://dev.mysql.com/doc/)) (You can use almost any other database too; see "Alternate databases")
* You need Redis. ([Reference](https://redis.io/download))
* You need Apache, with `mod_wsgi` installed. ([Reference](https://modwsgi.readthedocs.io/en/develop/))
* All following instructions assume Linux.

#### Instructions

Get the code

```bash
$ git clone https://github.com/LINKIWI/linkr.git
$ cd linkr/
```

Install dependencies

```bash
$ sudo apt-get install libmysqlclient-dev python-dev
$ virtualenv env
$ source env/bin/activate
$ pip install -r requirements.txt
$ npm install
```

Set up the MySQL database

```sql
CREATE USER 'linkr'@'localhost' IDENTIFIED BY 'super-secret-password';
CREATE DATABASE linkr;
GRANT ALL ON linkr.* TO 'linkr'@'localhost';
FLUSH PRIVILEGES;
```

Configuration options and secrets
  * Don't skip this step! Building and running the app will fail without config files!
  * Documentation for each available config option is in the Configuration section.

```bash
$ cp config/options/client.json.template config/options/client.json
$ cp config/options/server.json.template config/options/server.json
$ cp config/secrets/client.json.template config/secrets/client.json
$ cp config/secrets/server.json.template config/secrets/server.json
# You can leave the options as default, or modify to your liking. Make sure the server-side secrets
# config contains your database connection credentials.
```

Build the app.

```bash
$ NODE_ENV=production npm run build
```

Run the `linkr_setup.py` script to walk you through setting up the database and creating an admin user.

```bash
$ python linkr_setup.py
==========LINKR SETUP==========

This script is used for initializing Linkr for the first time on a new deployment.
This will create the Linkr MySQL tables and create an admin user account.
...
```

Almost there! An Apache virtual host config sample using WSGI:

```apache
<VirtualHost *:80>
    ServerName t.example.com

    AliasMatch "^/(linkr/(?!.*api/).+)?$" /path/to/linkr/frontend/static/dist/index.html
    Alias /static /path/to/linkr/frontend/static

    WSGIScriptAlias / /path/to/linkr/linkr.wsgi

    <Directory /path/to/linkr>
        Require all granted
    </Directory>
</VirtualHost>
```

The service is now live at `t.example.com`!

#### I am lazy and just want a prebuilt Docker image

Building the application from source is highly recommended. This is because the application's configuration options are specific to your installation, and must be configured before the application can run. Also, client-side secrets are bundled directly into the application as part of the build process, so it's not possible to distribute a pre-built frontend.

#### Alternate databases

The default database is MySQL, but you can change this to any database that is compatible with [`flask-sqlalchemy`](http://flask-sqlalchemy.pocoo.org/2.1/config/#connection-uri-format). Simply change `SQLALCHEMY_DATABASE_URI` in `config/flask.py` for the database of your choice.

## Configuration

#### `config/options/client.json`

|Key|Value|
|---|-----|
|`piwik`|An object of options to pass to [`piwik-react-router`](https://www.npmjs.com/package/piwik-react-router). *If your production infrastructure does not make use of [Piwik](http://piwik.org/), leave this as null*|

#### `config/options/server.json`

|Key|Value|
|---|-----|
|`linkr_url`|The public-facing URL to your Linkr installation, including the protocol and without a trailing forward slash.|
|`require_login_to_create`|True to require users to sign in before creating links; false to allow anonymous and signed-in users to create links.|
|`allow_open_registration`|True to allow anyone to register; false to disallow all registration.|
|`secure_frontend_requests`|True to allow the server to perform additional request validation to ensure that non-public API endpoints are only requested via Linkr's frontend interface. *It is recommended to leave this enabled, unless it is causing issues.*|

#### `config/secrets/client.json`

Note that all of these secrets are bundled into the frontend application at build time.

|Key|Value|
|---|-----|
|`sentry_client_dsn`|The client-side Sentry DSN key for this application. *If your production infrastructure does not make use of [Sentry](https://sentry.io) or you don't care about error reporting, leave this as null*|
|`recaptcha_site_key`|The client-side site key for this application from the Google ReCAPTCHA admin panel. *If you don't want to enable the human verification feature for links, leave this as null*|

#### `config/secrets/server.json`

|Key|Value|
|---|-----|
|`sentry_server_dsn`|The server-side Sentry DSN key for this application. *If your production infrastructure does not make use of [Sentry](https://sentry.io) or you don't care about error reporting, leave this as null*|
|`recaptcha_secret_key`|The server-side secret key for this application from the Google ReCAPTCHA admin panel. *If you don't want to enable the human verification feature for links, leave this as null*|
|`database.host`|The hostname or IP of the MySQL database.|
|`database.name`|The name of Linkr's database.|
|`database.user`|The username of the MySQL user for accessing the above database.|
|`database.password`|The password of the MySQL user for accessing the above database.|
|`redis.host`|The hostname of the Redis datastore.|
|`redis.port`|The port of the Redis datastore.|
