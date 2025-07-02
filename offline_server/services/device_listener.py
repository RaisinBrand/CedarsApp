import asyncio, json, logging
from typing import Dict, Any
import time

HELLO_PORT = 4210                         # same as Arduino sketch
registry: Dict[str, Dict[str, Any]] = {}  # stays right here

log = logging.getLogger(__name__)

async def _handle(reader: asyncio.StreamReader,
                  writer: asyncio.StreamWriter) -> None:
    try:
        data = await reader.read(64)
        msg  = json.loads(data.decode())
        if msg.get("type") == "hello" and "id" in msg:
            peer_ip = writer.get_extra_info("peername")[0]
            registry[msg["id"]] = {
                "ip":   peer_ip,
                "last": time.time()
            }
            log.info("hello from %s at %s", msg["id"], peer_ip)
    except Exception as exc:
        log.warning("bad packet: %s", exc)
    finally:
        writer.close()

async def run() -> None:
    server = await asyncio.start_server(_handle, "0.0.0.0", HELLO_PORT)
    log.info("TCP hello listener on :%d", HELLO_PORT)
    async with server:
        await server.serve_forever()
