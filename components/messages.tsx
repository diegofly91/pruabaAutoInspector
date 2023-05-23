import { useEffect, useRef } from "react"

export const Messages = ({ messages, className, username }) => {
    const chatContainerRef = useRef(null);
    const ultMessage = messages.length - 1;
    
    useEffect(() => {
      // Desplazamiento hacia el último mensaje
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages]);
  
    return (
        <div className={className} ref={chatContainerRef}>
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8 flex flex-col">
                {messages.map(({message }, index) => (
                        <div 
                            className={
                                `rounded-lg p-2 align-baseline leading-none w-auto ml-2 flex 
                                ${username === message.username ? 'self-end bg-indigo-800 text-indigo-100' : 'self-start bg-indigo-500 text-indigo-100'}`}
                            key={index}
                        >
                            {index === ultMessage && <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">New</span>}
                            <span className="font-semibold mr-2 text-left flex-auto">{message.content}</span> 
                            <span className={`ml-3 flex rounded-full uppercase px-2 py-1 text-xs font-bold mr-3  ${username === message.username ? ' bg-indigo-500 ': 'bg-indigo-800' } `}>
                                {message.username}
                            </span>
                        </div>
                ))
                }
            </div>    
        </div>
    )
}