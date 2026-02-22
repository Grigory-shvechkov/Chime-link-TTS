import subprocess
import sys
import time

# Paths to your scripts
FLASK_SCRIPT = "WebServer/webserver.py" # Your Flask server
NODE_SCRIPT = "DiscordBot/index.js" # Your Node bot

# Start Flask server
flask_process = subprocess.Popen([sys.executable, FLASK_SCRIPT])
print("Flask server started...")

# Give Flask a few seconds to start up
time.sleep(3)

# Start Node bot
node_process = subprocess.Popen(["node", NODE_SCRIPT])
print("Node bot started...")

try:
    # Keep this script running while child processes run
    flask_process.wait()
    node_process.wait()
except KeyboardInterrupt:
    print("Stopping both processes...")
    flask_process.terminate()
    node_process.terminate()
