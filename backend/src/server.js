import http from 'http';
import app from './app.js';
import { initSocket } from './socket.js';

const PORT = process.env.BACKEND_PORT || 3000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
