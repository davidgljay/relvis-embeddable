
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RelBasic from "./components/relbasic";
import Home from "./components/home"
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/relbasic" element={<RelBasic />} />
      </Routes>
    </BrowserRouter>
  );
}
