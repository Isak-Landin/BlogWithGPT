from flask import (
    redirect, url_for, jsonify, current_app, abort, request
)
from flask_login import login_required, current_user
import datetime
from bson.objectid import ObjectId

from models.notes import Note
from . import delete_bp


@delete_bp.route('/delete/<mongo_id>', methods=['DELETE',])
@login_required
def delete(delete_id):
    if request.method != 'DELETE':
        abort(404)

    mongo_id = ObjectId(delete_id)
    note = Note.objects(pk=mongo_id, is_deleted=False, user_id=str(current_user.pk)).first()
    if note:
        note.modify(deleted_at=datetime.datetime.now(), is_deleted=True)
        return jsonify({'message': 'Note deleted successfully.'}), 200
    else:
        return jsonify({'message': 'Note not found'}), 404

