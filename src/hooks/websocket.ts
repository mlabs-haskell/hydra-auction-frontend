import { useContext } from 'react';
import { WebSocketContext } from 'src/providers/WebSocketProvider';

export const useSocket = () => {
  const socket = useContext(WebSocketContext);

  return socket;
};
