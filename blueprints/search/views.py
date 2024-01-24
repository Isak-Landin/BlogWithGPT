from flask import Flask, render_template, request, jsonify
from flask import current_app
import pymongo
import datetime

from . import search_bp
from management_helpers.format_json_for_frontend import format_results


@search_bp.route('/search/<searchterm>', methods=['GET',])
def search(searchterm):
    # Perform the search logic (e.g., query your database)
    search_results = perform_search(searchterm)

    # temporary print to clarify contents of each return
    print(search_results)

    # Return the results as JSON
    return jsonify(search_results)


def perform_search(searchterm):
    regex_pattern = f'.*{searchterm}.*'
    regex = {'$regex': regex_pattern, '$options': 'i'}

    result_cursor = current_app.db.entries.find({'content': regex}).sort("updated_at", pymongo.DESCENDING)
    results = list(result_cursor)

    formatted_results = format_results(results)
    return formatted_results
