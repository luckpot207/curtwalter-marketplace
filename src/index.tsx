import React from "react";
import ReactDOM from "react-dom";
import { StoreProvider } from "./api/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotificationOverlay } from "./components/notifications";
import { ThemeProvider } from './lib/next-themes'
import { WalletProvider } from "./componentsV3/wallet/WalletProvider";
import { useCreateStore, Provider as ZustandProvider } from './lib/store'
import { Index } from "./pages";

import Explore from "./pages/explore";
import FAQ from "./pages/faq";
import Collection from "./pages/collection/[slug]";
import CollectionActivity from "./pages/collection/[slug]/activity";
import EditCollection from "./pages/collection/[slug]/edit";
import Token from "./pages/t";
import User from "./pages/user/[pubkey]";
import Privacy from "./pages/privacy";
import Stake from "./pages/stake";
import Submissions from "./pages/submissions";
import SubmissionsUpsert from "./pages/submissions/[id]";

import "./index.css";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


function App() {
  // @ts-ignore
  const createStore = useCreateStore({})

  return (
    <StoreProvider>
      <ZustandProvider createStore={createStore}>
        <ThemeProvider defaultTheme='light' themes={['light', 'dark']} attribute='class'>
          {/* <WalletProvider> */}
          <Router>
            <Routes>
              <Route path="/explore">
                <Explore />
              </Route>
              <Route path="/faq">
                <FAQ />
              </Route>
              <Route path="/collection/:slug/activity">
                <CollectionActivity />
              </Route>
              <Route path="/collection/:slug/edit">
                <EditCollection />
              </Route>
              <Route path="/collection/:slug">
                <Collection />
              </Route>
              <Route path="/t/:pubkey">
                <Token />
              </Route>
              <Route path="/user/:pubkey">
                <User />
              </Route>
              <Route path="/privacy">
                <Privacy />
              </Route>
              <Route path="/stake">
                <Stake />
              </Route>
              <Route path="/submissions/:id">
                <SubmissionsUpsert />
              </Route>
              <Route path="/submissions">
                <Submissions />
              </Route>
              <Route path="/">
                <Index />
              </Route>
            </Routes>
          </Router>
          <NotificationOverlay />
          {/* </WalletProvider> */}
        </ThemeProvider>
      </ZustandProvider>
    </StoreProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
