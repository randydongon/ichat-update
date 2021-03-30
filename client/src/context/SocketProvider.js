import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ id, children }) {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io("http://localhost:3030", { query: { id } }); //http://172.17.0.2:9000

    setSocket(newSocket);

    return () => newSocket.close();
  }, [id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

//websocket function
// const onWebsocket = (message) => {
//   if ("WebSocket" in window) {
//     console.log("websocket is support by your browser");

//     let ws = new WebSocket("ws://172.17.0.2:9393/ws/");

//     ws.onopen = function () {
//       console.log("Connection is open");
//       ws.send(message);
//     };

//     ws.onmessage = function (evt) {
//       let msg = evt.data;
//       console.log("Message is receive " + msg);
//     };

//     ws.onclose = function () {
//       console.log("Connection close");
//     };
//   } else {
//     console.log("WebSocket is not supported by your browser");
//   }
// };
