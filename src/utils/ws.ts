export interface WsResponse {
  id: string
  source: string
  headline: string
  assets: string[]
  link: string
  keywords: string[]
  timestamp: number
  priority: string
}

const reconnectInterval = 1000
let timer: number | null = null
export const connectWs = (props?: { onmessage?: (data: WsResponse) => void }) => {
  const ws = new WebSocket('ws://localhost:8080');

  ws.onopen = () => {
    console.log('Connected to server');
    ws.send('hello');
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  };

  ws.onmessage = (event) => {
    try {
      props?.onmessage?.(JSON.parse(event.data))
    } catch (e) {
      console.log('parse fail', e)
    }
  };

  ws.onclose = () => {
    if (!timer) timer = setInterval(() => connectWs({ onmessage: props?.onmessage }), reconnectInterval);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return ws
};
