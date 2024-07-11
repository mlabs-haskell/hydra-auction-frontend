import { MixpanelProvider } from 'react-mixpanel-browser';

const MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN || '';

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
