import React, { useState } from 'react';

export const ChatInput = ({ socket, className }) => {
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit("user:message", { content: message });
    setMessage('');
  };

  return (
        <div className={className}>
            <form className="flex items-center bg-gray-100 rounded-lg p-4 w-full">
                <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    className="flex-grow appearance-none bg-white border border-gray-300 rounded-full  px-4 mr-2 text-gray-700 focus:outline-none"
                    value={message}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
                    onClick={handleSubmit}
                >
                    Enviar
                </button>
                </form>
        </div>
  );
}

export default ChatInput;