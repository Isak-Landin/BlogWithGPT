from flask import (
    request, redirect, url_for, jsonify, current_app,
    abort, Response, session
)
from flask_login import login_required, current_user

from bson.objectid import ObjectId
from bson.errors import InvalidId
import datetime

from .forms import NoteForm
from models.notes import Note
from . import edit_bp


@edit_bp.route('/add', methods=['POST', 'GET'])
@login_required
def add():
    print('actually entering')
    form = NoteForm()
    response = {'message': ''}
    if form.validate_on_submit():
        # Parse JSON data sent with the request
        content = request.form.get('content')

        # Get user_id field from user object in MongoDB
        user_id = str(current_user.pk)

        # Create a new note object
        try:
            note = Note(
                content=content,
                user_id=user_id,
                updated_at=datetime.datetime.now(),
                created_at=datetime.datetime.now()
            )
            note.save()
            response['message'] = 'Note added successfully!'
        except Exception as e:
            response = jsonify({'error': str(e)})

    # Return a Response
    return redirect(url_for('home.home'))


@edit_bp.route("/delete/<mongo_id>", methods=['DELETE'])
@login_required
def delete(mongo_id):
    if not is_valid_object_id(mongo_id) or not does_entry_exist(mongo_id):
        abort(404)


@edit_bp.route('/edit/<mongo_id>', methods=['PUT'])
@login_required
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
