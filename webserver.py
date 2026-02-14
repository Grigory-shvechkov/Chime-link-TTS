from flask import Flask, request, jsonify
from gtts import gTTS
from playsound import playsound
from threading import Thread
import os

app = Flask(__name__)

# Function to play audio in a separate thread
def play_audio(file_name):
    playsound(file_name)
    # Optional: delete file after playing
    if os.path.exists(file_name):
        os.remove(file_name)

@app.route('/TTS', methods=['POST'])
def TTS():
    data = request.get_json()
    text = data.get('text')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    file_name = 'output.mp3'
    
    # Generate TTS audio
    tts = gTTS(text=text, lang='en')
    tts.save(file_name)

    # Play audio in background
    Thread(target=play_audio, args=(file_name,)).start()

    return jsonify({"status": "spoken", "text": text})


@app.route("/RING", methods=["POST"])  # Must be POST
def ring_endpoint():
    file_name = 'ring.mp3'
    Thread(target=playsound, args=(file_name,)).start()
    return jsonify({"status": "ringing"})


if __name__ == '__main__':
    print("Flask TTS server starting...")
    app.run(host='0.0.0.0', port=5000)
