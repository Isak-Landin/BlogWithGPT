import datetime
from bson.objectid import ObjectId


def format_results(entries):
    """
    Expects a mongodb cursor of entries, converted into a list.
    :param entries:
    :return: An application-compatible list of dictionaries. Each dictionary corresponds to a single entry in the database.
       Each dictionary contains the following keys:
       - mongo_id: The id of the entry in the database.
       - title: The title of the entry created with the content column in the database.
       - date: The date of the entry.
       - content: The content of the entry.
       - formattedDate: The formatted date of the entry.
    """
    print('################')
    print(entries)
    formatted_results = [
        {
            'title': entry.content[:30] + '...' if len(entry["content"]) > 30 else entry["content"],
            'date': entry.updated_at,
            'content': entry.content,
            'formattedDate': format_date(entry.updated_at),
            '_id': str(entry.pk)
        }
        for entry in entries
    ]

    return formatted_results


def format_date(date_str):
    if date_str is None:
        return 'Unspecified'
    # Convert 'YYYY-MM-DD' to a more readable format like 'Jan 01'
    return date_str.strftime("%b %d")
