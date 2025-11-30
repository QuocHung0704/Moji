import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import ChatAppPage from "./pages/ChatApp";
import {Toaster} from 'sonner'
function App() {

  return (
    <>
    <Toaster richColors/>
    <BrowserRouter>
      <Routes>
        {/* public route */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* protected route */}
        <Route path="/" element={<ChatAppPage />} />
      </Routes>
    </BrowserRouter></>
    
  );
}

export default App;
