#!/usr/bin/env python
# -*- coding: utf-8 -*-


from flask_login import UserMixin


__author__ = 'bac'



class LoggedUser(UserMixin):


    def __init__(self, userid):
        self.userid=userid


    def get_id(self):
        try:
            return unicode(self.userid)
        except AttributeError:
            raise NotImplementedError('No `id` attribute - override `get_id`')