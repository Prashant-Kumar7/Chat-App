import { WebSocket } from "ws";
import { PendingUser } from "./UserManager";

interface MsgObj {
    msg : string
    person : string
}


export class RoomManger {

    public user1 : PendingUser;
    public user2 : WebSocket;
    private msgArray : MsgObj[];
    public user1Name : string
    public user2Name : string

    constructor (user1: PendingUser, user2:WebSocket){
        this.user1 = user1
        this.user2 = user2
        this.msgArray = []
        this.user1Name = user1.name
        this.user2Name = ""
    }

    // msg: { sender: WebSocket; message: string; }

    sendMessages(socket: WebSocket, msg : string){
        const msgObj = {
            type : "message",
            msg : msg,
            person : "other"
        }

        if(socket === this.user1.socket){
            this.user2.send(JSON.stringify(msgObj))
            this.msgArray.push(msgObj)

        } else {
            this.user1.socket.send(JSON.stringify(msgObj))
            this.msgArray.push(msgObj)
        }
    }


    typingState(socket: WebSocket){
        if(socket === this.user1.socket){
            this.user2.send(JSON.stringify({type : "typing"}))
        } else {
            this.user1.socket.send(JSON.stringify({type : "typing"}))
        }
    }


    CloseConn(socket: WebSocket){
        if(this.user1.socket === socket){
            this.user2.send(JSON.stringify({msg : `${this.user1Name} left the chat`, person : "other" , type : "close_conn"}))
        } else if(this.user2 === socket){
            this.user1.socket.send(JSON.stringify({msg : `${this.user2Name} left the chat`, person : "other", type : "close_conn"}))
        }
        this.user1.socket.close()
        this.user2.close()
    }

    gotConnected(user1:WebSocket, user2:PendingUser){
        user1.send(JSON.stringify({msg : `hi from ${this.user1Name}`, person : "other" , type : "init_chat"}))
        user2.socket.send(JSON.stringify({msg : `hi from ${this.user2Name}`, person : "other", type : "init_chat"}))

    }
}