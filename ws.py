from simple_websocket_server import WebSocketServer, WebSocket
import json
import time

scrapers = []

class SimpleEcho(WebSocket):
    def handle(self):
        data = json.loads(self.data)
        for scraper in scrapers:
            if scraper != self:
                time.sleep(1)
                scraper.send_message(json.dumps(data))

    def connected(self):
        print(self.address[1], 'connected')
        scrapers.append(self)

    def handle_close(self):
        print(self.address[1], 'closed')


server = WebSocketServer('localhost', 8000, SimpleEcho)
server.serve_forever()
