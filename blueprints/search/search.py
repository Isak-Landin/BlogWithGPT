from flask import Flask, render_template, request, jsonify, Blueprint
from flask import current_app

import datetime

search_bp = Blueprint('search_bp', __name__)


@search_bp.route('/search/<searchterm>', methods=['GET',])
def search(searchterm):
    # Perform the search logic (e.g., query your database)
    search_results = perform_search(searchterm)

    # Return the results as JSON
    return jsonify(search_results)


def perform_search(searchterm):
    regex_pattern = f'.*{searchterm}.*'
    regex = {'$regex': regex_pattern, '$options': 'i'}

    result_cursor = current_app.db.entries.find({'content': regex})
    results = list(result_cursor)

    formatted_results = [
        {
            'title': result.get('content', '') + '...' if len(result.get('content', '')) > 30 else result.get('content', ''),
            'date': result.get('date', ''),  # Assuming 'date' is already in 'YYYY-MM-DD' format
            'content': result.get('content', ''),
            'formattedDate': format_date(result.get('date', ''))
        }
        for result in results
    ]
    return formatted_results


def format_date(date_str):
    if date_str is None:
        return 'Unspecified'
    # Convert 'YYYY-MM-DD' to a more readable format like 'Jan 01'
    formatted_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').strftime("%b %d")
    return formatted_date