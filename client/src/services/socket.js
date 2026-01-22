import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
    socket = null;

    connect() {
        this.socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ['websocket']
        });

        this.socket.on('connect', () => {
            console.log('Connected to socket');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from socket');
        });
    }

    joinRoom(room) {
        if (this.socket) {
            this.socket.emit('join_room', room);
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event) {
        if (this.socket) {
            this.socket.off(event);
        }
    }

    emit(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

const socketService = new SocketService();
export default socketService;
