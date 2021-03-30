import os.path
import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.auth
import tornado.options
import tornado.websocket
from tornado.options import define, options
from pymongo import MongoClient
from bson.json_util import dumps
from datetime import datetime
import json
# import logging
# import requests
from bson.objectid import ObjectId
from bson.binary import Binary
import time
import re
import base64
import gridfs
from flask import make_response, abort
from werkzeug.utils import secure_filename
from gridfs.errors import NoFile
import codecs
from urllib.parse import urljoin
from urllib.request import pathname2url
from pathlib import Path

# from capturestreams import mystreams

ALLOWED_EXTENSIONS = set(
    ['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'xlxs', 'xls', 'ods'])


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


define('port', default=3333, help='run on the given port', type=int)


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [(r"/adduser", MainHandler),
                    (r"/profile/(.*?)", MainHandler),
                    (r"/update", MainHandler),
                    (r'/sendmessage', HandleMessage),
                    (r'/uploadfile', HandleUploadFile),
                    (r'/uploadfile/(.*?)', HandleUploadFile),
                    (r'/receivemessage/(.*?)', HandleReceive),
                    (r'/users/profile', UsersProfile),
                    # view spicific profile
                    (r'/viewprofile/(.*?)', ViewProfile),
                    (r'/searchfriend/(.*?)', HandleAddFriends),
                    (r'/requestaddfriend', HandleAddFriends),
                    (r'/friend/request', HandleFriendRequest),
                    (r'/friend/request/(.*?)', HandleFriendRequest),
                    (r'/request/list/(.*?)', HandleFriendsList),
                    (r'/member/gc/(.*?)', HandleGcMember),
                    (r'/member/gc', HandleGcMember),
                    (r'/imageprofile/update', updateProfileImage),
                    # (r'/ws/', WebSocketHandler)
                    ]
        conn = MongoClient('mongodb://localhost:27017')
        # conn2 = MongoClient('mongodb://localhost:27018')

        self.db = conn.get_database('chatapp_db')
        # self.dbs = conn2.get_database('chatapp_db')

        tornado.web.Application.__init__(self, handlers, debug=True)

# pullTop


class MainHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        # print('set headers!!')
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Content-type', 'application/json')
        self.set_header('Access-Control-Allow-Methods',
                        'POST, GET, PUT, DELETE, OPTIONS')
        self.set_header('Access-Control-Allow-Headers',
                        'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Headers, X-Requested-By, Access-Control-Allow-Methods')

    def options(self):
        pass

    def post(self):

        coll = self.application.db.get_collection('user_profile')

        payload = json.loads(str(self.request.body, 'utf-8'))
        # check if the profile exists in database
        profile = coll.find_one({'email': payload['email'].strip()})

        # photo_binary = Binary(payload['photo_url'])
        if not profile:
            resp = coll.insert_one({'_id': payload['_id'], 'user_name': payload['user_name'], 'email': payload['email'], 'password': payload['password'], 'dob': payload['dob'],
                                    'gender': payload['gender'], 'photo_url': payload['photo_url'], 'imageid': payload['imageid'], 'isLogin': payload['isLogin'], 'friends_list': payload['friends_list']})

            id = payload['_id']
            name = payload['user_name']
            if re.findall('19:', id):
                friends = payload['friends_list']
                for item in friends:
                    resp = coll.update_one({'_id': item['id']}, {'$push': {'friends_list': {
                        '$each': [{'name': name, 'id': id}]}}})

            message = {
                'status_code': 200,
                'status_ok': 'pass',
                'message': 'User added!'}

        else:

            message = {
                'status_code': 400,
                'status_ok': 'fail',
                'message': 'Email already taken '}

        self.write(message)

    def get(self, email):
        useremail = email.strip()

        coll = self.application.db.get_collection('user_profile')
        if re.findall('@', email):
            user = coll.find_one({'email': useremail})
            self.write(user)
        else:
            user = coll.find_one({'_id': email}, {'isLogin': True})

            self.write(dumps(user))

        # if user:
        #     user['status'] = 200
        #     self.write(dumps(user))
        # if not user:
        #     message = {
        #         'status': 400,
        #         'message': 'Email or password doesnt match'
        #     }

        #     self.write(dumps(message))

    def put(self):  # update profile
        # result = self.prepare()

        coll = self.application.db.get_collection('user_profile')
        payload = json.loads(str(self.request.body, 'utf-8'))
        # resp = coll.find_one({'user_name': payload['user_name']})
        # id = str(ObjectId(resp['_id']))

        if not payload:
            return

        # print(payload, ' login user')
        # _id = id
        message = {}
        if payload['isLogin'] == False:
            coll.update_one({'email': payload['email']}, {
                            '$set': {'isLogin': True}})
            message = {
                'status': 200,
                'message': 'Login successfully'
            }
        elif payload['isLogin'] == True:
            # print('try to logout')

            coll.update_one({'_id': payload['user_id']}, {
                            '$set': {'isLogin': False}})

            message = {
                'status': 200,
                'message': 'Logoff successfully'
            }
        else:
            message = {
                'status': 401,
                'messsage': 'There was an error when login'
            }
        # resp = coll.update_one({'_id': ObjectId(_id['$oid'] if '$oid' in _id else ObjectId(_id))},
        #                        {'$set': {'user_name': payload['user_name'], 'email': payload['email'], 'password': payload['password'], 'gender': payload['gender'], 'photo_url': payload['photo_url'], 'mobile': payload['mobile']}})

        self.write(dumps(message))


class HandleMessage(MainHandler):

    def post(self):

        msg = json.loads(str(self.request.body, 'utf-8'))
        # msg = json.loads(msg['body'])
        # print(msg['fromid'])
        # return
        message = {}
        if msg:
            coll = self.application.db.get_collection('messages')

            senddate = time.asctime(time.localtime(time.time()))

            db = self.application.db
            # db.list_collection_name('messages').list_collection_name('inbox').insert(
            #     {'user_name': msg['user_name'], 'id': msg['id'], 'text': msg['text']})

            # coll.insert_one(
            #     {'username': msg['username'], 'id': msg['id'], 'text': msg['text'], 'datesend': senddate})

            id = msg['fromid']
            conversation_id = msg['conversation_id']
            cl = coll[conversation_id]
            # cl = db[id]
            cll = cl['inbox']
            sent = cll.insert_one(
                {'fromid': id, 'fromname': msg['fromname'], 'toid': msg['toid'], 'toname': msg['toname'], 'text': msg['text'], 'fileid': msg['fileid'], 'datesend': senddate})

            # increment notification by 1 when message sent
            if sent:
                notification_col = self.application.db.get_collection(
                    'user_profile')
                notification_col.update_one({'_id': msg['toid'], 'friends_list.id': id}, {
                    '$inc': {'friends_list.$.notification': 1}})

            # coll.update({'_id': id, 'friend_request.id': payload['peerid']}, {
            #     '$set': {'friend_request.$.status': True}})
            # coll['messages']['123']['inbox'].insert_one(
            #     {'datesend': senddate, 'username': msg['username'], 'id': msg['id'], 'text': msg['text'], 'datesend': senddate})

            messsage = {
                'status': 200,
                'message': 'Message sent'
            }
        else:
            message = {
                'status': 400,
                'message': 'Error: Unable to send message'
            }

        self.write(dumps(message))

    # update notification
    def put(self):

        msg = json.loads(str(self.request.body, 'utf-8'))

        coll = self.application.db.get_collection('user_profile')

        resp = coll.update_one({'_id': msg['_id'], 'friends_list.id': msg['peerid']}, {
            '$set': {'friends_list.$.notification': 0}})
        if resp:
            message = {
                'status': 200,
                'message': 'update notification'
            }
        else:
            message = {
                'status': 400,
                'message': 'Unabel to update notification'
            }

        self.write(dumps(message))

    def get(self):
        coll = self.application.db.get_collection('messages')
        msg = coll.find()

        self.write(dumps(msg))

# upload file

# image/file upload/download


class HandleUploadFile(MainHandler):
    def post(self):
        db = self.application.db

        # define gridfs
        fs = gridfs.GridFS(db)
        file = self.request.files['file']

        # if file and allowed_file(file[0].filename):
        filename = secure_filename(file[0].filename)
        # myfile = open('./downloads/'+filename, 'wb')
        # myfile.write(file[0].body)
        # myfile.close()

        stored = fs.put(
            file[0].body, content_type=file[0].content_type, filename=filename)
        # print(stored, 'file id')
        message = {
            'status': 200,
            'msgid': stored
        }

        self.write(dumps(message))
        # encoded = Binary(formData)

        # print(encoded, ' formdata image')
        # print(formData.body.caption)
        # coll = self.application.db.get_collection('messages')
        # coll.insert_one({'file': encoded})

    def get(self, id):
        db = self.application.db

        if id != 'no' and id != '' and id != 'undefined':
            try:
                file = db.fs.files.find_one({'_id': ObjectId(id)})

                filename = file['filename']
                contenttype = file['contentType']
                imgfile = set(['png', 'jpeg', 'jpg'])
                # filename = filename.split('.')
                fs = gridfs.GridFS(db)
                # print(filename[0])
                image = fs.get(ObjectId(id)).read()
                # if filename[1] in imgfile:
                base64_data = codecs.encode(image, 'base64')
                image = base64_data.decode('utf-8')
                messagefile = {
                    'filename': filename,
                    'contenttype': contenttype,
                    'file': image,

                    #
                }

                self.write(dumps(messagefile))
                # else:
                #     fx = fs.get(ObjectId(id)).read()
                #     contenttype = file['contentType']

                #     mm = file['filename']
                #     # myfile = open('./downloads/'+mm, 'rb')
                #     base64_data = codecs.encode(fx, 'base64')
                #     image = base64_data.decode('utf-8')
                #     # print('./downloads/'+mm)
                #     # p = Path('./downloads/', mm)
                #     # myfile = open('./downloads/'+mm, 'wb')
                #     # myfile.write(fx)
                #     # myfile.close()
                #     # newfile = open('./downloads/'+mm, 'rb')
                #     # newfile = newfile.read()
                #     messagefile = {'filename': mm,
                #                    'contenttype': contenttype,
                #                    'filex': image}

                #     self.write(dumps(messagefile))

            except NoFile:
                abort(404)
        else:

            message = {
                'status': 200,
                'message': 'no',
                'filepath': '',


            }
            self.write(dumps(message))


class UsersProfile(MainHandler):
    def get(self):
        coll = self.application.db.get_collection('user_profile')
        resp = coll.find()
        # print(resp)

        if resp:
            self.write(dumps(resp))
        else:
            message = {
                'status': 400,
                'message': 'Error while retreiving users'
            }
            self.write(message)


class HandleReceive(MainHandler):

    def get(self, id):

        # print(nid, ' user ID ')

        coll = self.application.db.get_collection('messages')

        id_col = coll[id]

        inbox_col = id_col['inbox']

        msg = inbox_col.find()  # .sort([('$natural', -1)]).limit(25)
        # for ms in msg:
        #     print(ms, 'message ')

        # msg = coll.find().sort([('$natural', -1)]).limit(25)
        msglist = []

        for x in msg:
            msglist.append(x)
        # msglist.reverse()
        # print(msglist)
        self.write(dumps(msglist))
        # message = {
        #     'status': 200,
        #     'message': 'message found'
        # }
        # self.write(dumps(message))


class HandleAddFriends(MainHandler):
    def options(self):
        pass

    def post(self):  # update friends list
        coll = self.application.db.get_collection('user_profile')
        payload = json.loads(str(self.request.body, 'utf-8'))

        id = payload['_id']
        # add to friends list
        resp = coll.update_one({'_id': id}, {'$push': {'friends_list': {
            '$each': [{'name': payload['name'], 'id':payload['id']}]}}})
        # update request status to true
        # coll.update({'_id': id, 'friend_request.id': payload['peerid']}, {
        #             '$set': {'friend_request.$.status': True}})
        if resp:

            message = {
                'status_code': 200,
                'status_ok': 'pass',
                'message': 'User added!'}

        else:

            message = {
                'status_code': 400,
                'status_ok': 'fail',
                'message': 'Email already taken '}

        self.write(message)

    def get(self, name):  # search user
        coll = self.application.db.get_collection('user_profile')
        val = str(name.strip())
        resp = coll.find(
            {'user_name': {'$regex': '.*{}.*'.format(val), '$options': 'i'}})

        if resp:
            self.write(dumps(resp))
        else:
            message = {
                'status': 400,
                'message': "Cannot find in the database -> {}".format(val)
            }
            self.write(dumps(message))


class HandleFriendRequest(MainHandler):
    def options(self):
        pass

    def put(self):
        coll = self.application.db.get_collection('user_profile')
        payload = json.loads(str(self.request.body, 'utf-8'))
        # print(payload,  'friend request')
        if payload['peerid'] and payload['user_id']:

            # find if already send a friend request
            # res = coll.find_one({"_id": payload['peerid']}, {
            #     "friend_request":    {"$elemMatch": {"id": payload['user_id']}}})
            # resone = dumps(res)

            res = coll.find_one({'_id': payload['peerid']}, {'friends_list': {
                '$elemMatch': {'id': payload['user_id']}}})

            # resone = dumps(res)

            # print(resone, ' resone')

            # res = coll.find({'_id': payload['user_id']}, {'friend_request': {
            #     '$elemMatch': {'id', payload['peerid']}}})

            # db.user_profile.find({"_id":"c111318a-c12f-45a9-8d4a-2cdd81feaab7"},{"friend_request":{"$elemMatch":{"id":"4508be1e-852a-4c9d-8c78-025e9f16eb3d"}}})
            # res = dumps(res)

            # if found notify a requestor
            item = None
            for x in res:
                if not re.findall('_id', x):
                    item = res[x]
                    # print(res[x][0]['id'])
            if item:
                # print(item[0]['id'], " item")
                message = {
                    'status': 201,
                    'message': 'Friend is already added!'
                }
                self.write(dumps(message))

            else:
                # print("Item doesn't exists")
                # insert friend request on friends profile
                friend_resp = coll.update_one({'_id': payload['peerid']}, {'$push': {'friends_list': {
                    '$each': [{'name': payload['user_name'], 'id':payload['user_id'], 'status':False}]}}})
                # update current user friends list after send friend request
                current_resp = coll.update_one({'_id': payload['user_id']}, {'$push': {'friends_list': {
                    '$each': [{'name': payload['peername'], 'id':payload['peerid']}]}}})

                message = {}

                if friend_resp and current_resp:
                    message = {
                        'status': 200,
                        'message': 'Friend added successfully!'
                    }
                else:
                    message = {
                        'status': 501,
                        'message': "Error while adding friend"
                    }

                self.write(dumps(message))

            # print(resone, 'res')

            # for re in res:
            #     print(re)

        #     else:
        #         # insert friend request on friends profile
        #         resp = coll.update_one({'_id': payload['peerid']}, {'$push': {'friend_request': {
        #             '$each': [{'name': payload['user_name'], 'id':payload['user_id'], 'status':False}]}}})

        #         # update friends list after send friend request
        #         coll.update_one({'_id': payload['user_id']}, {'$push': {'friends_list': {
        #             '$each': [{'name': payload['peername'], 'id':payload['peerid']}]}}})

        #         if resp:
        #             self.write(
        #                 dumps({'status': 200, 'message': 'request sent'}))
        #         else:
        #             message = {
        #                 'status': 404,
        #                 'message': 'Error sending friend request. ',
        #             }
        #             self.write(dumps(message))
        # else:
        #     message = {
        #         'status': 400,
        #         'message': payload
        #     }

        #     self.write(dumps(message))

    def get(self, id):
        coll = self.application.db.get_collection('user_profile')

        resp = coll.find({'_id': id}, {'friend_request'})
        if resp:
            self.write(dumps(resp))
        else:

            message = {
                'status': 400,
                'message': 'No request found'
            }
            self.write(dumps(message))


class HandleGcMember(MainHandler):
    def post(self):
        pass

    # update gc member or add member
    def put(self):
        coll = self.application.db.get_collection('user_profile')
        payload = json.loads(str(self.request.body, 'utf-8'))
        name = payload['name']
        id = payload['gcid']

        # update group name
        if name:
            coll.update_one(
                {'_id': id}, {'$set': {'user_name': name}})
            message = {
                'status': 200,
                'message': 'OK'
            }
            self.write(dumps(message))

        # update member
        member = payload['member']
        if member:
            for x in payload['member']:
                coll.update_one({'_id': id}, {'$push': {'friends_list': {
                    '$each': [{'name': x['name'], 'id':x['id']}]}}})

            message = {
                'status': 200,
                'message': 'OK'
            }
        # self.write(dumps(message))

    def get(self, id):
        coll = self.application.db.get_collection('user_profile')
        # retreive gc member
        resp = coll.find({'_id': id}, {'friends_list'})

        if resp:
            gc = []
            try:
                for x in resp:
                    gc = x['friends_list']

            except TypeError as e:
                print(e)
            self.write(dumps(gc))
        else:

            message = {
                'status': 400,
                'message': 'No request found'
            }
            self.write(dumps(message))


class updateProfileImage(MainHandler):
    def options(self):
        pass

    def post(self):
        pass

    def put(self):
        coll = self.application.db.get_collection('user_profile')
        payload = json.loads(str(self.request.body, 'utf-8'))
        id = payload['id']

        if id:
            # update profile image id
            resp = coll.update_one(
                {'_id': id}, {'$set': {'imageid': payload['imageid']}})

            message = {
                'status': 200,
                'message': 'ok'
            }
            self.write(dumps(message))
        else:
            message = {
                'status': 400,
                'message': 'fail'
            }
            self.write(dumps(message))

    def get(self):
        pass


class HandleFriendsList(MainHandler):
    def get(self, id):
        coll = self.application.db.get_collection('user_profile')
        resp = coll.find_one({'_id': id})
        item = None
        # print(resp['friends_list'])
        if not resp:
            return
        for x in resp:
            if not re.findall('_id', x):
                # print(resp[x])
                item = resp[x]
        # print(dumps(item))

        if item:
            self.write(dumps(item))
        else:
            message = {
                'status': 400,
                'message': "You haven't added any friends on your list"
            }
            self.write(dumps(message))


class ViewProfile(MainHandler):
    def get(self, id):
        coll = self.application.db.get_collection('user_profile')
        resp = coll.find_one({'_id': id})

        # print(resp)

        if resp:
            self.write(dumps(resp))
        else:
            message = {
                'status': 200,
                'message': 'Unable to find profile with id:' + id
            }


if __name__ == '__main__':
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

    # file = db.fs.files.find_one({'_id': ObjectId(id)})
    # filename = file['filename']
    # imgfile = set(['png', 'jpeg', 'jpg'])
    # filename = filename.split('.')
    # fs = gridfs.GridFS(db)
    # # f = fs.get(ObjectId(id)).read()
    # image = fs.get(ObjectId(id)).read()
    # if filename[1] in imgfile:
    #     base64_data = codecs.encode(image, 'base64')
    #     image = base64_data.decode('utf-8')
    #     messagefile = {
    #         'filename': filename,
    #         'file': image
    #         #
    #     }
    #     self.write(dumps(messagefile))
