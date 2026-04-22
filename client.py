import subprocess
import sys
import time
import os

# Paths to your scripts
FLASK_SCRIPT = "WebServer/webserver.py"
NODE_SCRIPT = "DiscordBot/index.js"

RESTART_DELAY = 5  # seconds before restarting a crashed process

def start_flask():
    print("Starting Flask server...")
    return subprocess.Popen([sys.executable, FLASK_SCRIPT])

def start_node():
    print("Starting Node bot...")
    return subprocess.Popen(["node", NODE_SCRIPT])

flask_process = start_flask()
time.sleep(3)  # give Flask a moment to initialize
node_process = start_node()

try:
    while True:
        # Check Flask
        if flask_process.poll() is not None:
            print(f"Flask crashed with code {flask_process.returncode}, restarting in {RESTART_DELAY}s...")
            time.sleep(RESTART_DELAY)
            flask_process = start_flask()

        # Check Node
        if node_process.poll() is not None:
            print(f"Node crashed with code {node_process.returncode}, restarting in {RESTART_DELAY}s...")
            time.sleep(RESTART_DELAY)
            node_process = start_node()

        time.sleep(2)  # polling interval

except KeyboardInterrupt:
    print("Stopping both processes...")
    flask_process.terminate()
    node_process.terminate()
    flask_process.wait()
    node_process.wait()
