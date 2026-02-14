from flask import Flask, request, jsonify
from gtts import gTTS
from playsound import playsound

app = Flask(__name__)

@app.route('/TTS',methods=['POST'])
def TTS():
    data = request.get_json()
    text = data['text']
    if not text:
        return jsonify({'error': 'No text provided'}), 400

    fileName = 'output.mp3'
    TTS = gTTS(text=text, lang='en')
    TTS.save(fileName)
    playsound(fileName)

    return jsonify({"status": "spoken", "text": text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)