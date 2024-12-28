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
          <Route path="token-listing" element={<TokenListing />} />
        </Routes>
      </PeraWalletProvider>
    </Router>
  );
};

export default App;
