import io from 'socket.io-client';
const socket = io('http://localhost:1337'); // URL of your Strapi backend

export default ({ app }, inject) => {
  inject('socket', socket);
};