import getpass
import sys
import traceback

import linkr
import database.common
import database.user


def main():
    """
    Main procedure; prompts the user interactively for input.
    """
    print '==========LINKR SETUP=========='
    print ''
    print 'This script is used for initializing Linkr for the first time on a new deployment.'
    print 'This will create the Linkr MySQL tables and create an admin user account.'
    print 'Please ensure you have created the MySQL user and database BEFORE running this script.'
    print 'Please ensure that you have copied and modified the templates from config/*/*.json. ' \
          'and set all config options to your liking.'
    print 'It is especially important that all database configuration constants are set properly ' \
          '(host, name, username, password).'

    print 'Press any key to continue or ^C to quit.'
    wait_for_enter()
    verify_config()

    print ''
    print 'Press any key to create the Linkr database and tables.'
    wait_for_enter()
    setup_db()

    print 'Enter the username and password for the admin user.'
    admin_username = raw_input('Admin username: ')
    admin_password = getpass.getpass('Admin password: ')
    admin_password_verify = getpass.getpass('Verify admin password: ')
    if admin_password != admin_password_verify:
        print 'The admin password does not match the verification password! Please try again.'
        sys.exit(1)
    setup_admin(admin_username, admin_password)

    print 'Setup complete!'


def verify_config():
    """
    Verify that the configuration options are set properly.
    """
    try:
        config = __import__('config')
        print 'Configuration read successfully!'
        print 'Linkr URL: {url}'.format(url=config.options.server['linkr_url'])
        print 'Database host: {db_host}'.format(db_host=config.secrets.server['database']['host'])
        print 'Database name: {db_name}'.format(db_name=config.secrets.server['database']['name'])
        print 'Database username: {db_user}'.format(
            db_user=config.secrets.server['database']['user'],
        )
        print 'Database password: {db_pass}'.format(
            db_pass=config.secrets.server['database']['password'],
        )
    except:
        print 'There was an error reading the config files!'
        print 'Ensure that you have copied and modified the templates from config/*/*.json.'
        sys.exit(1)


def setup_db():
    """
    Create the database tables.
    """
    try:
        database.common.create_tables()
    except:
        print 'There was an error creating the tables. Are you sure your database credentials ' \
              'are correct?'
        print 'The full stack trace is as follows:'
        traceback.print_exc()
        sys.exit(1)


def setup_admin(username, password):
    """
    Create the admin user account.
    :param username: The desired admin username.
    :param password: The desired admin password.
    """
    try:
        database.user.add_user(
            username=username,
            password=password,
            signup_ip='127.0.0.1',
            is_admin=True,
        )
    except:
        print 'There was an error creating the admin user. Are you sure the database user ' \
              'specified by your config has write permissions to the database?'
        print 'The full stack trace is as follows:'
        traceback.print_exc()
        sys.exit(1)


def wait_for_enter():
    """
    Block execution until the user presses enter.
    """
    raw_input()


if __name__ == '__main__':
    main()
