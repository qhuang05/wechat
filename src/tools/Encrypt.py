#!/usr/bin/env python
# -*- coding: utf-8 -*-

__author__ = 'bac'


import hashlib
import hmac
import base64


def hash_sha1(text):
    """

    :param text:
    :return:
    """
    hash_it = hashlib.sha1()
    hash_it.update(text)
    return hash_it.hexdigest()

def hash_sha256(text):
    """
    HASH sha256
    :param text:
    :return:
    """
    hash_it = hashlib.sha256()
    hash_it.update(text)
    return hash_it.hexdigest()

def hmac_with_sha1(secret_key, content):
    """
    使用 sha1算法做 hmac
    :param secret_key:
    :param content:
    :return:
    """
    return hmac.new(secret_key.encode("utf-8"), content.encode("utf-8"), hashlib.sha1).digest()

def base64_encode(content):
    return base64.urlsafe_b64encode(content)