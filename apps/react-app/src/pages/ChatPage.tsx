
import { useEffect, useState, useRef } from 'react'
import { ChatMessage } from "../components/ChatMessage"
import '../App.css'
import { useParams } from 'react-router-dom'
// import { Button } from '@repo/ui/button'

interface Obj {
  msg : string
  person: string
  type : string
} 


function ChatPage() {
    const {userName} = useParams();

    const INIT_CONN = {
        "type" : "init_conn",
        "name" : userName
    }
      
      const CLOSE_CONN = {
        "type" : "Close",
    } 

  const [socket, setSocket] = useState<any>(null)
  const bottomOfChatRef = useRef<HTMLDivElement>(null)
  const [connected, setConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [loading , setLoading] = useState(false)
  const [message, setMessage] = useState("");
  const [objArray, setobjArray] = useState<Obj[]>([])
  const [inputDisable , setInputDisable] = useState(true)

  function startConnection(){
    const socket = new WebSocket("ws://localhost:8080")
    socket.onopen = ()=>{
      console.log('connected')
      setSocket(socket)
    }

    socket.onmessage = (message)=>{
      console.log(`recived message :${message.data}`)
      const msgObj = JSON.parse(message.data)

      if(msgObj.type === "typing"){
        setTyping(true) 
      }
      
      if(msgObj.type === "message" || msgObj.type === "init_chat") {
        setLoading(false)
        setInputDisable(false)
        setobjArray((obj)=>{
          return [...obj, msgObj]
        })
      }

      if(msgObj.type === "close_conn"){
        setobjArray((obj)=>{
          return [...obj, msgObj]
        })
      }

    }

    socket.onclose = ()=>{

      setConnected(false)
      setInputDisable(true)
      setSocket(null)
      startConnection()
    }
  }


  useEffect(()=>{
    startConnection();
    return ()=>{
      if(socket){
        socket.close()
      }
    }
    
  },[])

  useEffect(()=>{
    if(bottomOfChatRef.current){
      bottomOfChatRef.current.scrollIntoView()
    }
  }, [objArray])


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setTyping(false)
    }, 500)


    return () => clearTimeout(delayDebounceFn)
  }, [typing])

  if(!socket){
    return <div>
      Connecting to a socket server...
    </div>
  }

  const Message = {
    "type" : "Message",
    "msg" : message
  }


  function sendMessage(){
    if(socket){
      socket.send(JSON.stringify(Message));
    }


    const msgObj = {
      msg : message,
      person : "me"
    }

    setobjArray((obj : any)=>{
      return [...obj, msgObj]
    })

    setMessage("")
  }

  function handleChange(e: any){
    setMessage(e.target.value)
    const typeObj = {
      type : "Typing"
    }
    if(socket){
      socket.send(JSON.stringify(typeObj))
    }
  }

  function handleGetConnected(){
    setLoading(true)
    setMessage("");
    setobjArray([])
    
    if(socket){
      socket.send(JSON.stringify(INIT_CONN))
      setConnected(true)
    }
    setMessage("");
    setobjArray([])

  }


  function closeConn(){

    setLoading(false)
    const endChat = {
      msg : "You left the chat",
      person : "me",
      type : "close_conn"
    }

    if(socket){
      socket.send(JSON.stringify(CLOSE_CONN))
      setConnected(false) 
    }

    setInputDisable(true)
    setobjArray((obj : any)=>{
      return [...obj , endChat]
    })

  }

  return (
    <div className='border-2 border-gray-500 rounded-lg flex flex-col'>
      <div>
        <div style={{height : "30rem", width : "30rem"}} className='overscroll-y-auto p-2'>
          {objArray.map((item)=>{
            console.log(item)
            return <ChatMessage 
                    person={item.person}
                    msg={item.msg}
                    Type={item.type}
                  />
          })}
          <div className='flex justify-start'>
            {typing ? <div ref={bottomOfChatRef}>typing</div> : <div ref={bottomOfChatRef}></div> }

          </div>
          {loading? <div style={{height: "100%"}} className='flex justify-center items-center w-full'>Connecting you to Someone...</div>  : <div></div> }
        </div>
        <div className='flex'>
          <input disabled={inputDisable} style={{width : "88%", border : "0px"}} className='p-1 rounded-lg' autoFocus onChange={handleChange} type="text" placeholder='Enter Msg' />
          <button onClick={sendMessage} className='p-1 rounded-lg'>send</button>
        </div>

      </div>
      <div>
        {connected ? <button onClick={closeConn}>leave</button> : <button onClick={handleGetConnected}>get connected</button> }
      </div>
    </div>
  )
}
export default ChatPage