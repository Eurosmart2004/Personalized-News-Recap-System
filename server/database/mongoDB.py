from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/mydatabase'  # Replace with your MongoDB connection URI
mongo = PyMongo(app)

@app.route('/')
def index():
    # Access the MongoDB collection
    collection = mongo.db.mycollection

    # Insert a document
    document = {'name': 'John', 'age': 30}
    collection.insert_one(document)

    # Retrieve documents
    documents = collection.find()
    for doc in documents:
        print(doc)

    return 'Hello, MongoDB!'

if __name__ == '__main__':
    app.run()