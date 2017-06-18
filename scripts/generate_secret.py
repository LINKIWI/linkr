import os

SECRET_FILE = '.secret'


def generate_secret():
    # No need to regenerate a new secret if one already exists
    if os.path.isfile(SECRET_FILE):
        print 'Secret already exists on disk; skipping.'
        return

    with open(SECRET_FILE, 'w') as secret_file:
        secret_file.write(os.urandom(32))
        print 'Generated a new secret.'


if __name__ == '__main__':
    generate_secret()
