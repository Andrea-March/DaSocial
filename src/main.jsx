import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import './styles/reset.css'
import './styles/colors.css'
import './styles/global.css'

import { registerSW } from 'virtual:pwa-register'

registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);