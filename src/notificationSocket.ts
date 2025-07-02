import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';

export function createNotificationClient(userId: number, onMessage: (msg: any) => void) {
  const socket = new SockJS('http://localhost:8080/ws-notifications');
  const stompClient = Stomp.over(socket);

  stompClient.reconnect_delay = 5000; // <--- enables built-in reconnects
  stompClient.heartbeat.incoming = 10000;
  stompClient.heartbeat.outgoing = 10000;
  stompClient.debug = () => {}; // mute logging

  stompClient.onConnect = () => {
    stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
      if (message.body) {
        const notification = JSON.parse(message.body);
        onMessage(notification);
      }
    });
  };

  stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ', frame);
  };

  stompClient.onWebSocketClose = () => {
    console.warn('WebSocket closed — attempting reconnect');
  };

  stompClient.onDisconnect = () => {
    console.warn('Disconnected');
  };

  stompClient.activate();
  return stompClient;
}