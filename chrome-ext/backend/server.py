from flask import Flask, jsonify, request
from flask_cors import CORS

from model import clean

app = Flask(__name__)
CORS(app)

# Example route for GET request
@app.route('/api/data', methods=['GET'])
def get_data():
    # Process GET request and return response
    data = {'message': 'Hello from the backend!'}
    return jsonify(data)

# Example route for POST request
@app.route('/api/submit', methods=['POST'])
def submit_data():
    # Process POST request data
    submitted_data = request.json
    cleaned_data = clean(submitted_data)

    # Perform some processing with the submitted data
    #result = do_processing(submitted_data)

    # Return the processed result
    return jsonify(submitted_data)

if __name__ == '__main__':
    app.run()