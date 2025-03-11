import {getMixpanelPage } from "src/providers/MixPanelProvider";

export default function Analytics() {
  const page = getMixpanelPage();

  return (
    <div>
      <div className="w-full ml-auto mr-auto relative h-[600px]">
        <iframe
          title="MixPanel Report"
          src={"https://mixpanel.com/p/" + page}
          className="top-0 left-0 w-full h-full absolute borner-none"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
