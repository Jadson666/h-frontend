import type { WsResponse } from './ws';

export class SocketManager {
  retryDelay: number;
  url: string;
  ws: WebSocket | null;
  timer: number | null;
  onmessage: (data: WsResponse) => void;
  constructor(url: string, onmessage: (data: WsResponse) => void, retryDelay = 1000) {
    this.url = url;
    this.retryDelay = retryDelay;
    this.onmessage = onmessage;
    this.ws = null;
    this.timer = null;
    this.connect();
  }

  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected.');
      return; // Prevent duplicate connections
    }
    this.cleanup() // here to avoid memory leak
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('Connected to server');
      this.ws?.send('hello');
      if (this.timer) clearInterval(this.timer);
    };

    this.ws.onmessage = (event) => {
      try {
        this.onmessage(JSON.parse(event.data));
      } catch (e) {
        console.log('parse fail', e);
      }
    };

    this.ws.onclose = () => {
      if (!this.timer) this.timer = setInterval(() => this.reconnect(), this.retryDelay);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  reconnect() {
    this.connect();
  }

  cleanup() {
    if (this.ws) {
      this.ws.onopen = this.ws.onclose = this.ws.onerror = null; // Remove event listeners
    }
  }

  close() {
    this.ws?.close();
  }
}
