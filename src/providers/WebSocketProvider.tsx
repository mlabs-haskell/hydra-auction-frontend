import { PropsWithChildren, useState, useEffect, useRef } from 'react';
import {
  WEBSOCKET_DEFAULT_STATE,
  WebSocketContext,
  WebSocketReadyState,
} from 'src/contexts/WebSocketContext';

// for now we will use one wss and re create it on every url change
// if we want to keep multiple open we could use a map or object of wss and identify them by the auctionInfo.delegateInfo.wsServers
// would need a max number of wss to keep open
// if the requested one is not found we create new one and discard the oldest

export const WebSocketProvider = ({ children }: PropsWithChildren) => {
  const ws = useRef<WebSocket | null>(null);
  const [wsUrl, setWsUrl] = useState<string>(WEBSOCKET_DEFAULT_STATE.wsUrl);
  const prevWsUrl = useRef<string | null>(null);
  const [readyState, setReadyState] = useState<WebSocketReadyState>(
    WEBSOCKET_DEFAULT_STATE.readyState
  );

  useEffect(() => {
    /* WS initialization and cleanup */
    if (!wsUrl) return;
    if (ws.current) {
      if (prevWsUrl.current !== wsUrl) {
        ws.current.close();
        setReadyState(WebSocketReadyState.CLOSING);
        ws.current = new WebSocket(wsUrl);
        setReadyState(WebSocketReadyState.CONNECTING);

        prevWsUrl.current = wsUrl;
      }
    } else {
      ws.current = new WebSocket(wsUrl);
      setReadyState(WebSocketReadyState.CONNECTING);

      prevWsUrl.current = wsUrl;
    }

    if (ws.current) {
      ws.current.onopen = () => {
        console.log('WS open');
        setReadyState(WebSocketReadyState.OPEN);
      };
      ws.current.onclose = () => {
        console.log('WS close');
        setReadyState(WebSocketReadyState.CLOSED);
      };
      ws.current.onmessage = (message: MessageEvent) => {
        //   const { type, ...data } = JSON.parse(message.data);
        console.log('WS message', message.data);
      };
    }

    return () => {
      ws.current?.close();
    };
  }, [wsUrl, ws]);

  const value = {
    wsUrl,
    wss: ws.current,
    readyState,
    setWsUrl,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
