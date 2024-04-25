import { useContext } from 'react';
import { WebSocketContext } from 'src/contexts/WebSocketContext';

export const useSocket = () => {
  const socket = useContext(WebSocketContext);

  return socket;
};
