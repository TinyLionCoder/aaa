import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AuthWrapper from "./components/AuthWrapper";
import Navbar from "./components/Navbar";
import { PeraWalletProvider } from "./components/PeraWalletProvider";
import { TermsOfServices } from "./components/TermsOfServices";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { TokenListing } from "./components/TokenListing";
import { AboutUs } from "./components/Aboutus";
import { AAASwap } from "./components/AAASwap";
import BestAlgoDefi from "./components/BestAlgoDefi";
import { Contact } from "./components/contact";
import { DisplayCurrentAirdrops } from "./components/DisplayCurrentAirdrops";

const App = () => {
  return (
    <Router>
      <PeraWalletProvider>
        <Navbar />
        <Routes>
          {/* <Route path="/" element={<LandingPage />} /> */}
          <Route path="/" element={<AuthWrapper />} />
          <Route path="/referral/:referralCode" element={<AuthWrapper />} />
          <Route path="/terms-of-services" element={<TermsOfServices />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="token-listing" element={<TokenListing />} />
          <Route path="swap-tokens" element={<AAASwap />} />
          {/* <Route path="current-airdrops" element={<DisplayCurrentAirdrops />} /> */}
          <Route path="best-algo-defi" element={<BestAlgoDefi />} />
        </Routes>
      </PeraWalletProvider>
    </Router>
  );
};

export default App;
