from flask import Flask, render_template, request, jsonify
from flask import current_app
from mongoengine.queryset.visitor import Q
from flask_login import login_required, current_user

from models.notes import Note
from . import search_bp
from management_helpers.format_json_for_frontend import format_results


@search_bp.route('/search/<searchterm>', methods=['GET',])
@login_required
def search(searchterm):
    def perform_search(search_term, user_id):
        results = Note.objects(Q(content__icontains=search_term), user_id=user_id).order_by('-updated_at')

        formatted_results = format_results(results)
        return formatted_results

    # Perform the search logic (e.g., query your database)
    search_results = perform_search(searchterm, user_id=str(current_user.pk))

    # temporary print to clarify contents of each return
    print(search_results)

    # Return the results as JSON
    return jsonify(search_results)

