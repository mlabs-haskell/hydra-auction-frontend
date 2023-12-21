export default function Footer() {
  return (
    <footer className="bg-black w-full h-96 flex justify-between px-6 py-16">
      <div className="h-full flex  items-center">
        <div className="flex flex-col gap-8">
          <p className="text-white font-bold text-body">
            Join the Hydra Auction community
          </p>
          <div className="flex text-pink-600 gap-5 items-center">
            <a href="http://github.com" target="_blank" rel="noreferrer">
              <img src="/images/github.png" alt="github" />
            </a>
            <a href="http://facebook.com" target="_blank" rel="noreferrer">
              <img src="/images/fb.png" alt="facebook" />
            </a>
            <a href="http://instagram.com" target="_blank" rel="noreferrer">
              <img src="/images/ig.png" alt="instagram" />
            </a>
            <a href="http://twitter.com" target="_blank" rel="noreferrer">
              <img src="/images/twitter.png" alt="twitter" />
            </a>
          </div>
          <div className="flex ">
            <input
              className="mr-3"
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
