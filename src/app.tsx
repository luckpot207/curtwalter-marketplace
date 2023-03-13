import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FAQ from "./FAQ";
import { Index } from "./pages";
import { ApplyLaunchPad } from "./pages/applyLaunchpad";
import { Collection } from "./pages/collection/[slug]";
import { Sale, Auction } from "./pages/explore";
import { Launches } from "./pages/launches";
import { Token } from "./pages/launchpad";
import { User } from "./pages/user/[pubkey]";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/explore/sale" element={<Sale />} />
        <Route path="/explore/auction" element={<Auction />} />
        <Route path="/collection/:slug" element={<Collection />} />
        <Route path="/user/:pubkey" element={<User />} />
        <Route path="/t" element={<Token />} />
        <Route
          path="/applylaunch"
          element={<ApplyLaunchPad loader={false} />}
        />
        <Route path="/launches" element={<Launches />} />
      </Routes>
    </Router>
  );
}

export default App;
