# offline_server.py
from fastapi import FastAPI, HTTPException
from typing import List
from pydantic import BaseModel
import threading
import socket
import json
from collections import deque
import time
import logging, asyncio, time
from services.device_listener import run, registry
logging.basicConfig(level=logging.INFO)


'''
STEPS:
1. Run source venv/bin/activate
2. If you haven't alr, install fastapi and uvicorn via pip install
3. Run the script via uvicorn main:app --reload
4. Samples should be received via print(f"Received {len(chunk.samples)} samples") if Arduino is tranmissing TCP packets 

http://127.0.0.1:8000/docs#/ if u wanna make sure endpoints are working
uvicorn main:app --host 0.0.0.0 --port 8000 --reload to run the server
'''


'''
update 7/1

run this: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
 to listen to device connections. if you are sending pacekts over air correctly, you are guanrateed 
 to see the arduino giga ong bro

'''


app = FastAPI()
class SampleChunk(BaseModel):
    samples: List[int]  # or List[float] if your data is float

# @app.get("/")
# def read_root():
#     return {"message": "test run"}

@app.on_event("startup")
async def _start_listener():
    print("🎯 starting device listener")
    asyncio.create_task(run())           # fire-and-forget

@app.get("/devices/", summary="List live boards")
def list_devices():
    """Return boards seen in the last 10 s."""
    now = time.time()
    return {k: v for k, v in registry.items() if now - v["last"] < 10}





