import express from 'express'
import { WebSocketServer, WebSocket } from 'ws'
import { UserManager } from './managers/UserManager';

const app = express()
const httpServer = app.listen(8080)

const wss = new WebSocketServer({ server: httpServer });


const clients = new Map();
const userManger = new UserManager()



wss.on('connection', function connection(ws){
  userManger.addUser(ws)
})














// wss.on('connection', function connection(ws) {



//   userManger.addUser(ws)

//   const id = uuidv4();
//   const color = Math.floor(Math.random() * 360);
//   const metadata = { id, color };
//   clients.set(ws, metadata);


//   ws.on('message', function message(data, isBinary) {


//     // const message = {
//     //   data : data,
//     //   sender : "",
//     //   color : ""
//     // };
//     // const metadata = clients.get(ws);

//     // message.sender = metadata.id;
//     // message.color = metadata.color;
//     // const outbound = JSON.stringify(message);

//     // [...clients.keys()].forEach((client) => {
//     //   console.log(message)
//     //   client.send(outbound, { binary: isBinary });
//     // });


//     console.log(`recived : ${data}`)
//     wss.clients.forEach(function each(client) {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(data, { binary: isBinary });
//       }
//     });
//   });

  

//   ws.send("hi from wss")

//   // ws.on("close", () => {
//   //     clients.delete(ws);
//   //   });

// });

// function uuidv4() {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16);
//   });
// }