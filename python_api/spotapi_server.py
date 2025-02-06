from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS # type: ignore
from spotapi import SpotApi # type: ignore

app = Flask(__name__)
CORS(app)  # Allow requests from Node.js

# Initialize SpotAPI
spot = SpotApi()

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q')
    if not query:
        return jsonify({'error': 'Missing query parameter'}), 400

    results = spot.search(query, types=["track", "album", "artist"])
    return jsonify(results)

@app.route('/track/<track_id>', methods=['GET'])
def get_track(track_id):
    track_info = spot.track(track_id)
    return jsonify(track_info)

if __name__ == '__main__':
    app.run(port=3000)
