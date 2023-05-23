import { connect } from "socket.io-client";
import { useState, useEffect } from "react";
import { Messages, ChatInput } from '../components/index';
import styles from '../styles/page.module.css';

const SOCKET_URI = "http://localhost:3001";

export const connectToSocket = () => {
  const socket = connect(SOCKET_URI);
  // socket.onAny((event, content) =>
  //       console.log("event received", event, content)
  // );
  return socket;
};

export default function Page() {
  const [socket, setSocket] = useState(null);
  const [ newUser, setNewUser ] = useState('')
  const [ newPassword , setNewPassword ] = useState('')
  const [ username, setUsername ] = useState(null);
  const [ messages, setMessages ] = useState([]);
  
  useEffect(() => {
    const socket = connectToSocket();
    setSocket(socket);
    socket.on("session",({username}) =>{ setUsername(username) });
    socket.on("message",(message) => { setMessages(prev => [...prev, message]) });
  },[])

  if(username) return (
    <div className={styles.chat}>
      <div className={styles.title}>
        <h2 className="text-4xl font-bold text-gray-800 py-2"> Welcome to my Chat </h2>
      </div>
      <Messages messages={messages} className={styles.messages} username={username}/>
      <ChatInput socket={socket} className={styles.send} />
    </div>
  );
  
  return (
    <div className="flex space-y-10 flex justify-center align-center">
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8 flex flex-col">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
          </h1>
          <input
            type="text"
            name="username"
            onChange={(e) => setNewUser(e.target.value)}
            placeholder="Enter your username"
            className="border border-gray-300 rounded-md px-4 py-2"
          />
          <input
            type="text"
            name="password"
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your password"
            className="border border-gray-300 rounded-md px-4 py-2"
          />

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => {
              socket.auth = { username: newUser, password: newPassword };
              socket.connect();
            }}
          >
            Send
          </button>
      </div>
    </div>
  );
}
