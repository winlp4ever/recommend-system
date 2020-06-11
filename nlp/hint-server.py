import socketio
import asyncio
from hints import Hints 

sio = socketio.AsyncClient(ssl_verify=False)

async def run(): 
    Hs = Hints()

    @sio.event
    def connect():
        print('connection established')

    @sio.on('poll-hints')
    async def on_message(msg):
        await sio.emit('q-hints', {
            "uid": msg["uid"],
            "hints": Hs.getHints(msg['q'])
        })

    @sio.on('ask')
    async def on_message(msg): 
        await sio.emit('answer', {
            "uid": msg["uid"],
            "answer": Hs.getAnswer(msg['q'])
        })

    @sio.event
    def disconnect():
        print('disconnected from server')

    await sio.connect('http://localhost:5000')
    await sio.wait()

#asyncio.run(run())
loop = asyncio.get_event_loop()
loop.run_until_complete(run())
