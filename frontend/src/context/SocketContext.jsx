// src/socket/SocketContext.js
import { createContext, useContext, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);

    useEffect(() => {
        const socket = io(process.env.REACT_APP_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000/', {
            transports: ['websocket'],
            withCredentials: true
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socketRef.current}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);