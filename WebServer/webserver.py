from flask import Flask, request, jsonify
from gtts import gTTS
from playsound import playsound
from threading import Thread
import os

app = Flask(__name__)
dir_path = os.path.dirname(os.path.realpath(__file__))

# Function to play audio in a separate thread
def play_audio(file_name):
    if os.path.exists(dir_path + "/" + file_name):
        playsound(dir_path + "/" + file_name)
        os.remove(dir_path + "/" + file_name)
   
       

@app.route('/TTS', methods=['POST'])
def TTS():
    data = request.get_json()
    text = data.get('text')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    file_name = 'output.mp3'
    
    # Generate TTS audio
    tts = gTTS(text=text, lang='en')
    tts.save(dir_path + "/" + file_name)

    # Play audio in background
    Thread(target=play_audio, args=(file_name,)).start()

    return jsonify({"status": "spoken", "text": text})


@app.route("/RING", methods=["POST"])  # Must be POST
def ring_endpoint():
    file_name = 'ring.mp3'
    if os.path.exists(dir_path + "/" + file_name):
        Thread(target=playsound, args=(dir_path + "/" + file_name,)).start()
    else:
        print(dir_path + "/" + file_name, "Not Found!")
    return jsonify({"status": "ringing"})


if __name__ == '__main__':
    print("Flask TTS server starting...")
    app.run(host='0.0.0.0', port=5000)
