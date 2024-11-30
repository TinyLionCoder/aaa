import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AuthWrapper from "./components/AuthWrapper";
import Navbar from "./components/Navbar";
import { PeraWalletProvider } from "./components/PeraWalletProvider";

const App = () => {
  return (
    <Router>
      <PeraWalletProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthWrapper />} />
        </Routes>
      </PeraWalletProvider>
    </Router>
  );
};

export default App;
