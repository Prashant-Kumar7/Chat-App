// import { Socket } from "socket.io";
// import { RoomManager } from "./RoomManager";

import { WebSocket } from "ws";
import { RoomManger } from "./RoomManager";

export interface PendingUser {
    socket : WebSocket,
    name : string
}


export class UserManager {
    private rooms : RoomManger[]
    private users: WebSocket[]; 
    private pendingUser: PendingUser | null;
    // private roomManager: RoomManager;
    
    constructor() {
        this.users = [];
        this.rooms = [];
        this.pendingUser = null
        // this.roomManager = new RoomManager();
    }

    addUser(socket: WebSocket) {
        this.users.push(socket)
        this.addHandler(socket)
    }


    removeUser(socket: WebSocket){
        this.users = this.users.filter(user => user !== socket)
    }


    private addHandler(socket: WebSocket){
        socket.on('message', (data)=>{
            
            const message = JSON.parse(data.toString())
            
            //when users ask to get them connected to others

            if (message.type === "init_conn"){

                if(this.pendingUser){
                    const room = new RoomManger(this.pendingUser, socket)
                    room.user2Name = message.name
                    room.user1Name = this.pendingUser.name
                    this.rooms.push(room)
                    room.gotConnected(socket, this.pendingUser)
                    this.pendingUser = null

                }else {
                    this.pendingUser = {
                        socket : socket,
                        name : message.name
                    }
                }
            }


            const room = this.rooms.find(room=> room.user1.socket === socket || room.user2 === socket);
            
            //when any user wants to send msg to another user  
            if (message.type === "Message"){
                if(room){
                    room.sendMessages(socket, message.msg)
                }
                
            }


            if (message.type === "Typing"){
                //when user1 is typing, user2 gets to know that user1 is typing and vice-versa
                if(room){
                    room.typingState(socket)
                }
            }

            if (message.type === "Close"){
                // when user1 have asked to be connected to user2 and before user2 is avaiable the user decides to leave the connection
                if(this.pendingUser?.socket === socket){
                    this.pendingUser = null
                }


                if(room){
                    room.CloseConn(socket)
                    this.rooms = this.rooms.filter((emptyRoom)=>{
                        return room != emptyRoom
                    })
                }
            }
        })
    }
}