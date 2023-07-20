from flask import Flask
from flask_cors import CORS
from flask import request
from websocket import create_connection
import json

ws = create_connection("ws://localhost:8000")

app = Flask(__name__)
CORS(app)

@app.post("/gpt")
def root():
    ws.send(json.dumps({
        'sender': 'http-server',
        'message': request.form.get('prompt')
    }))
    data = json.loads(ws.recv())
    if data['error'] == 1:
        return '', 403
    message = data['message']
    return message

if __name__ == '__main__':
    app.run(debug=True, port=5001)