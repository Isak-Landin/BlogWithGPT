from pymongo import MongoClient
from bson.objectid import ObjectId

# Connect to MongoDB (example connection)
client = MongoClient('mongodb://localhost:27017/')
db = client['your_database']
collection = db['your_collection']

# The string representation of the ObjectId
id_string = '5f50c31e11b36bcfb5d7a2c8'

# Query the document
document = collection.find_one({"_id": ObjectId(id_string)})

# Do something with the document
print(document)