# offline_server.py
from fastapi import FastAPI, HTTPException
from typing import List
from pydantic import BaseModel
import threading
import socket
import json
from collections import deque
import time

'''
STEPS:
1. Run source venv/bin/activate
2. If you haven't alr, install fastapi and uvicorn via pip install
3. Run the script via uvicorn main:app --reload
4. Samples should be received via print(f"Received {len(chunk.samples)} samples") if Arduino is tranmissing TCP packets 

http://127.0.0.1:8000/docs#/ if u wanna make sure endpoints are working
uvicorn main:app --host 0.0.0.0 --port 8000 --reload to run the server
'''

def process_samples(samples):
    print(f"[TCP] Received {len(samples)} samples: {samples[:10]}...")
    maybe_start_new_test()
    current_test.extend(samples)  # <-- Add this line!
    return {"status": "received", "count": len(samples)}


# change ip address to the ip address of the computer running the server
def tcp_server_thread(host='172.20.10.5', port=4210, chunk_size=10):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind((host, port))
    s.listen(1)
    print(f"[TCP] Listening on {host}:{port}")
    while True:
        conn, addr = s.accept()
        print(f"[TCP] Connection from {addr}")
        with conn:
            buffer = b''
            while True:
                data = conn.recv(1024)
                if not data:
                    break
                buffer += data
                # Process in chunks
                while len(buffer) >= chunk_size:
                    chunk = buffer[:chunk_size]
                    buffer = buffer[chunk_size:]
                    # Convert bytes to ints (assuming 1 byte per sample)
                    samples = list(chunk)
                    process_samples(samples)
        print(f"[TCP] Connection from {addr} closed")

tcp_thread = threading.Thread(target=tcp_server_thread, daemon=True)
tcp_thread.start()



app = FastAPI()

# # Shared data store (mirrors your C server's latest_values)
# latest_values: List[int] = [0] * 10
# lock = threading.Lock()

# @app.get("/emg", response_model=List[int])
# def read_emg():
#     with lock:
#         return latest_values
    

# You can add another endpoint to receive UDP data if you want Python to
# replace your C listener. But for now this just returns the current array.

class SampleChunk(BaseModel):
    samples: List[int]  # or List[float] if your data is float

# Set your desired history length
HISTORY_LENGTH = 10000  # or whatever N you want

# This will store the most recent N samples
history_buffer = deque(maxlen=HISTORY_LENGTH)

test_history: List[List[int]] = []  # Each inner list is a test
current_test: List[int] = []
last_received_time = time.time()
TEST_TIMEOUT = 2.0  # seconds

def maybe_start_new_test():
    global current_test, last_received_time
    now = time.time()
    if now - last_received_time > TEST_TIMEOUT and current_test:
        test_history.append(current_test.copy())
        current_test.clear()
    last_received_time = now

@app.post("/ingest")
def ingest_samples(chunk: SampleChunk):
    maybe_start_new_test()
    current_test.extend(chunk.samples)
    print(f"Received {len(chunk.samples)} samples")
    return {"status": "received", "count": len(chunk.samples)}

@app.get("/history")
def get_history():
    # Return all completed tests + the current one (if not empty)
    all_tests = test_history + ([current_test] if current_test else [])
    return {"tests": all_tests}

# @app.post("/start_test")
# def start_test():
#     global current_test
#     if current_test:
#         test_history.append(current_test)
#     current_test = []
#     return {"status": "new test started", "num_tests": len(test_history) + 1}
