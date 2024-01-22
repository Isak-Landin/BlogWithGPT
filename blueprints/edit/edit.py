from flask import (
    Blueprint, Flask, render_template,
    request, redirect, url_for, jsonify, current_app,
    abort, Response
)
from bson.objectid import ObjectId
from bson.errors import InvalidId

from create_form_fields import NoteForm

import pymongo

edit_bp = Blueprint('edit', __name__)


@edit_bp.route("/<mongo_id>", methods=['POST', 'GET'])
def edit(mongo_id):
    if not is_valid_object_id(mongo_id) or not does_entry_exist(mongo_id):
        abort(404)

    form = NoteForm()
    if form.validate_on_submit():
        entry_id = mongo_id
        entry_content = request.form.get("content")
        current_app.db.entries.update_one({"_id": ObjectId(entry_id)}, {"$set": {"content": entry_content}})

    entry = None
    if request.method == 'GET':
        entry = current_app.db.entries.find_one({"_id": ObjectId(mongo_id)}).sort("date", pymongo.DESCENDING)
        if entry:
            return jsonify({'content': entry['content']})  # Content derived from db.test.find({"_id" : ObjectId(
            # mongo_id)}).sort("date",
        # pymongo.DESCENDING).
    elif request.method == 'POST':
        return redirect(url_for('home.home'))

    return abort(Response('Something went wrong! Entry: ' + str(entry) if entry else 'Some unknown error, contact '
                                                                                     'support', 404))


@edit_bp.route("/delete/<mongo_id>", methods=['DELETE'])
def delete(mongo_id):
    if not is_valid_object_id(mongo_id) or not does_entry_exist(mongo_id):
        abort(404)


@edit_bp.route('/save/<mongo_id>', methods=['PUT'])
def save(mongo_id):
    print(mongo_id)
    print(is_valid_object_id(mongo_id))
    print(does_entry_exist(mongo_id))
    if not is_valid_object_id(mongo_id) or not does_entry_exist(mongo_id):
        abort(404)

    # Parse JSON data sent with the request
    data = request.get_json()

    # Extract content field
    _id = mongo_id
    content = data.get('content')

    # Update database
    try:
        current_app.db.entries.update_one({"_id": ObjectId(_id)}, {"$set": {"content": content}})
    except InvalidId:
        return jsonify({'message': 'Invalid ID!'})
    except pymongo.errors.DuplicateKeyError:
        return jsonify({'message': 'Note exists as duplicate!'})
    except Exception as e:
        return jsonify({'message': str(e)})

    # Return a Response
    return jsonify({'message': 'Note updated successfully!'})


def is_valid_object_id(id):
    try:
        ObjectId(id)
        return True
    except InvalidId:
        return False


def does_entry_exist(mongo_id):
    entry = current_app.db.entries.find_one({"_id": ObjectId(mongo_id)})
    return entry is not None
