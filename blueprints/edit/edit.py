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


@edit_bp.route("/edit/<mongo_id>", methods=['POST', 'GET'])
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


def is_valid_object_id(id):
    try:
        ObjectId(id)
        return True
    except InvalidId:
        return False


def does_entry_exist(mongo_id):
    entry = current_app.db.entries.find_one({"_id": ObjectId(mongo_id)})
    return entry is not None
