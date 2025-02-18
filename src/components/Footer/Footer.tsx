import { StringInput } from '../Inputs/StringInput';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black w-full h-96 flex justify-between px-6 py-16">
      <div className="h-full flex  items-center">
        <div className="flex flex-col gap-8">
          <p className="text-white font-bold text-body">
            Join the Hydra Auction community
          </p>
          <div className="flex text-pink-600 gap-5 items-center">
            <Link to="https://ikigaitech.org" target="_blank" rel="noreferrer">
              <img src="./images/ikigai-logo.png" alt="twitter" className='w-6 h-6'/>
            </Link> 
            <Link to="https://twitter.com/ikigai_tech" target="_blank" rel="noreferrer">
              <img src="./images/twitter.png" alt="twitter" />
            </Link> 
            <Link to="https://github.com/mlabs-haskell/hydra-auction-frontend" target="_blank" rel="noreferrer">
              <img src="./images/github.png" alt="github - frontend code" />
            </Link> 
            <Link to="https://mlabs.city" target="_blank" rel="noreferrer">
              <img src="./images/mlabs.png" alt="twitter" className='w-6 h-6'/>
            </Link> 
            <Link to="https://twitter.com/MLabs10" target="_blank" rel="noreferrer">
              <img src="./images/twitter.png" alt="twitter" className='w-6 h-6'/>
            </Link> 
            <Link to="https://github.com/mlabs-haskell/hydra-auction-onchain" target="_blank" rel="noreferrer">
              <img src="./images/github.png" alt="github - onchain contracts" />
            </Link> 
            <Link to="https://github.com/mlabs-haskell/hydra-auction-offchain" target="_blank" rel="noreferrer">
              <img src="./images/github.png" alt="github - offchain library" />
            </Link> 
          </div>
          <div className="flex ">
            <StringInput
              className="mr-3 w-48 md:w-96"
              inputClassName="p-2"
              placeholder="Email Address"
              label=""
              inputId="email"
            ></StringInput>
            <button className="border border-white text-white px-5 text-callout font-semibold">
              Subscribe
            </button>
          </div>
          <p className="font-bold text-white">Get the latest updates</p>
        </div>
      </div>
      <div className="h-full flex  items-center">
        <div className="text-white font-bold flex flex-col gap-8">
          <Link to="https://github.com/mlabs-haskell/hydra-auction-frontend/blob/master/LICENSE">Terms</Link> 
          <Link to="https://github.com/mlabs-haskell/hydra-auction-frontend/issues">Contact Us</Link> 
          <Link to="./delegate-portal">Register a Delegate Group</Link> 
        </div>
      </div>
    </footer>
  );
}
