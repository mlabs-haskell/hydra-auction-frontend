import { StringInput } from '../Inputs/StringInput';

// TODO: add icons for socials
export default function Footer() {
  return (
    <footer className="bg-black w-full h-96 flex justify-between px-6 py-16">
      <div className="h-full flex  items-center">
        <div className="flex flex-col gap-8">
          <p className="text-white font-bold  text-body">
            Join the Hydra Auction community
          </p>
          <div className="flex text-pink-600 gap-3 ">
            <div>Twitter</div>
            <div>Instagram</div>
            <div>Facebook</div>
            <div>Github</div>
          </div>
          <div className="flex ">
            <input
              className="me-3"
              type="string"
              placeholder="Email Address"
            ></input>
            <button className="border border-white text-white px-5 text-callout font-semibold">
              Subscribe
            </button>
          </div>
          <p className="font-bold text-white">Get the latest updates</p>
        </div>
      </div>
      <div className="h-full flex  items-center">
        <div className="text-white font-bold flex flex-col gap-8">
          <a href="/">Terms</a>
          <a href="/">Privacy Policy</a>
          <a href="/">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
