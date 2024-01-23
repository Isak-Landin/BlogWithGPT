from flask import (
    request, redirect, url_for, jsonify, current_app,
    abort, Response, session
)

from bson.objectid import ObjectId
from bson.errors import InvalidId

from .forms import NoteForm
from models.notes import Note
from . import edit_bp


@edit_bp.route('/add', methods=['POST'])
def add():
    form = NoteForm()

    if form.validate_on_submit():
        # Parse JSON data sent with the request
        data = request.get_json()

        # Extract content field
        content = data.get('content')

        # Get user_id field from session
        user_id = session.get('user_id')


    # Return a Response
    return jsonify({'message': 'Note added successfully!'})

@edit_bp.route("/delete/<mongo_id>", methods=['DELETE'])
def delete(mongo_id):
    if not is_valid_object_id(mongo_id) or not does_entry_exist(mongo_id):
        abort(404)


@edit_bp.route('/edit/<mongo_id>', methods=['PUT'])
def edit(mongo_id):
    if not is_valid_object_id(mongo_id) or not does_entry_exist(mongo_id):
        abort(404)
    form = NoteForm()

    if form.validate_on_submit():
        # Parse JSON data sent with the request
        data = request.get_json()

        # Extract content field
        _id = mongo_id
        content = data.get('content')


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
