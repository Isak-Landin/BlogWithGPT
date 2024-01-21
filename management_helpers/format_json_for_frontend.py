import datetime
from bson.objectid import ObjectId


def format_results(entries):
    """
    Expects a mongodb cursor of entries, converted into a list.
    :param entries:
    :return: A application-compatible list of dictionaries. Each dictionary corresponds to a single entry in the database.
       Each dictionary contains the following keys:
       - mongo_id: The id of the entry in the database.
       - title: The title of the entry created with the content column in the database.
       - date: The date of the entry.
       - content: The content of the entry.
       - formattedDate: The formatted date of the entry.
    """
    formatted_results = [
        {
            'mongo_id': str(entry["_id"]),
            'title': entry["content"][:30] + '...' if len(entry["content"]) > 30 else entry["content"],
            'date': entry["date"],
            'content': entry["content"],
            'formattedDate': format_date(entry["date"])
        }
        for entry in entries
    ]

    return formatted_results


def format_date(date_str):
    if date_str is None:
        return 'Unspecified'
    # Convert 'YYYY-MM-DD' to a more readable format like 'Jan 01'
    return datetime.datetime.strptime(date_str, "%Y-%m-%d").strftime("%b %d")
