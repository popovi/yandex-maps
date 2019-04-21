import * as http from "http";
import * as socketIo from "socket.io";
import { app, initializeApp } from "./expressApp";
import { onSocket } from "./socket";

let server;

initializeApp(app);
server = http.createServer(app);
server.on("listening", onListening);
server.listen(app.get("port"));

const socketServer = socketIo(server, { serveClient: false });
socketServer.on("connection", onSocket);

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.info('Listening on ' + bind);
}