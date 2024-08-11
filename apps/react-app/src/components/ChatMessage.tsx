interface PropType {
    person : string
    msg : string
    Type : string
}

export const ChatMessage = ({person, msg, Type} : PropType)=>{

    if(Type === "close_conn"){
        return (
            <div className="flex justify-center border-2">
                <span>{msg}</span>
            </div>
        )
    }

    
    if(person === "me"){
        return (
            <div className="flex justify-end">
                <span>{msg}</span>
            </div>
        )

    }else if (person=== "other"){
        return (
            <div className="flex">
                <span>{msg}</span>
            </div>
        )
    }


}