import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"    
import "./index.css"
import './admin/utils.js'
import App from './admin/App.jsx'   // just comment this and uncomment the other App.jsx to open ur website

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)