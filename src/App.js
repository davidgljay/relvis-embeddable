
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Definition from "./pages/reldefinition";
import Limits from "./pages/limitstoprediction";
import Home from "./pages/home";
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/reldefinition" element={<Definition />} />
        <Route path="/limitstoprediction" element={<Limits />} />
      </Routes>
    </BrowserRouter>
  );
}
