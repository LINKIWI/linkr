import json

import requests

import config.secrets


def validate_recaptcha(recaptcha_resp, remote_ip):
    """
    Validate the ReCAPTCHA response provided by the client with the upstream validation server.

    :param recaptcha_resp: String response of the ReCAPTCHA procedure, supplied by the client.
    :param remote_ip: Remote IP address of this client.
    :return: True if the ReCAPTCHA is valid; False otherwise
    """
    verify_resp = requests.post(
        url='https://www.google.com/recaptcha/api/siteverify',
        data={
            'secret': config.secrets.RECAPTCHA_SECRET_KEY,
            'response': recaptcha_resp,
            'remoteip': remote_ip,
        },
    )

    return json.loads(verify_resp.text).get('success')
