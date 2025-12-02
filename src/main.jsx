import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import './styles/reset.css'
import './styles/colors.css'
import './styles/global.css'

import { registerSW } from 'virtual:pwa-register'
import { UserProvider } from "./context/UserContext";
import { ToastProvider } from "./context/ToastContext";
import { PostProvider } from "./context/PostContext";

registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider >
      <ToastProvider >
        <PostProvider >
          <App />
        </PostProvider>
      </ToastProvider>
    </UserProvider >
  </BrowserRouter>
);