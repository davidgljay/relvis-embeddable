
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RelDefinition from "./pages/reldefinition";
import Home from "./pages/home"
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/reldefinition" element={<RelDefinition />} />
      </Routes>
    </BrowserRouter>
  );
}
