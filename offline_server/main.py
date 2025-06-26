# offline_server.py
from fastapi import FastAPI, HTTPException
from typing import List
from pydantic import BaseModel
import threading
import socket
import json

'''
STEPS:
1. Run source venv/bin/activate
2. If you haven't alr, install fastapi and uvicorn via pip install
3. Run the script via uvicorn main:app --reload
4. Samples should be received via print(f"Received {len(chunk.samples)} samples") if Arduino is tranmissing TCP packets 
'''



def process_samples(samples):
    # This function mimics ingest_samples logic for TCP
    print(f"[TCP] Received {len(samples)} samples: {samples[:10]}...")
    # You can add filtering, normalization, etc. here
    return {"status": "received", "count": len(samples)}

def tcp_server_thread(host='0.0.0.0', port=4210, chunk_size=10):
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

@app.post("/ingest")
def ingest_samples(chunk: SampleChunk):
    # TODO: filter, normalize, enqueue, etc.
    # For now, just print or store the samples
    print(f"Received {len(chunk.samples)} samples")
    return {"status": "received", "count": len(chunk.samples)}

# # In-memory buffer for raw samples
# raw_samples_buffer: List[int] = []

# @app.post("/append_raw")
# def append_raw(samples: List[int]):
#     """Append raw samples to the buffer."""
#     raw_samples_buffer.extend(samples)
#     print(f"[HTTP] Appended {len(samples)} samples. Total: {len(raw_samples_buffer)}")
#     return {"status": "success", "total_samples": len(raw_samples_buffer)}

# @app.get("/history")
# def get_history():
#     """Return all stored samples as JSON."""
#     return {"samples": raw_samples_buffer}
