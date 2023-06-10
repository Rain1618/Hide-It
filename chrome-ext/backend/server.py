from flask import Flask, jsonify, request
from flask_cors import CORS

from model import clean, run_model

app = Flask(__name__)
CORS(app)

# GET request route
@app.route('/api/data', methods=['GET'])
def get_data():
    # Process GET request and return response
    data = {'message': 'Hello from the backend!'}
    return jsonify(data)

# POST request route
@app.route('/api/submit', methods=['POST'])
def submit_data():

    # Process POST request data
    submitted_data = request.json
    cleaned_data = clean(submitted_data)
    probability_data = run_model(cleaned_data)

    # Return the processed result
    return jsonify(submitted_data)

if __name__ == '__main__':
    app.run()