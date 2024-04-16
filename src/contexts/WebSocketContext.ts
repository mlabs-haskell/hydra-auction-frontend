import { createContext } from 'vm';

export enum WebSocketReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

type WebSocketContextType = {
  wsUrl: string;
  wss: WebSocket | null;
  readyState: WebSocketReadyState;
  setWsUrl: (url: string) => void;
};

export const WEBSOCKET_DEFAULT_STATE: WebSocketContextType = {
  wsUrl: '',
  wss: null,
  readyState: WebSocketReadyState.CLOSED,
  setWsUrl: () => {},
};

export const WebSocketContext = createContext(WEBSOCKET_DEFAULT_STATE);
