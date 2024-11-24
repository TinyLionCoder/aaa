import React from "react";
import AuthWrapper from "./components/AuthWrapper";
import { PeraWalletProvider } from "./components/PeraWalletProvider";


function App() {
  return (
    <div className="App">
      <PeraWalletProvider>
        <AuthWrapper />
      </PeraWalletProvider>
    </div>
  );
}

export default App;
