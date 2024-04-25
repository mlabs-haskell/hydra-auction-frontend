import { MixpanelProvider } from 'react-mixpanel-browser';
const MIXPANEL_TOKEN = '49875218022b6630ddb9a1142a2df3e8';

// [OPTIONAL] Custom options to pass to `mixpanel.init()`.
const MIXPANEL_CONFIG = {
  ignore_dnt: true, // Ignore Do Not Track (DNT) browser setting
  debug: true, // Enable debug mode
  // track_pageview: true, // Set to `false` by default
};

export default function MixPanelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MixpanelProvider token={MIXPANEL_TOKEN} config={MIXPANEL_CONFIG}>
      {children}
    </MixpanelProvider>
  );
}
