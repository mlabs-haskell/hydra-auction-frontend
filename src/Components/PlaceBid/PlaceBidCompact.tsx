import { useState } from 'react';
import { PlaceBidForm } from './PlaceBid';

export default function PlaceBidCompact() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShow(!show)}
        className="w-full p-3 border border-gray-700 rounded-3xl mb-2"
      >
        Place Bid
      </button>
      {show && <PlaceBidForm />}
    </div>
  );
}
