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

# POST request route -> takes posts from frontend + user preferences & returns triggering posts only
@app.route('/api/submit', methods=['POST'])
def submit_data():

    submitted_data = request.json
    print(submitted_data)
    print("triggers :", submitted_data['triggers'])
    print("threshold :", submitted_data['threshold'])

    # clean posts
    cleaned_data = clean(submitted_data['data'])

    # get user prefs
    triggers = submitted_data['triggers']
    threshold = submitted_data['threshold']

    # get labels based off of post & user prefs
    probability_data = run_model(cleaned_data, triggers, threshold)

    # return the processed result
    return probability_data

if __name__ == '__main__':
    app.run()