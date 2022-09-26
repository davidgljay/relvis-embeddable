
import { HashRouter, Routes, Route } from "react-router-dom";
import Definition from "./pages/reldefinition";
import Limits from "./pages/limitstoprediction";
import RelGraph from "./pages/relgraph";
import Structure from "./pages/relstructure";
import Home from "./pages/home";
import './App.css';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/reldefinition" element={<Definition />} />
        <Route path="/limitstoprediction" element={<Limits />} />
        <Route path="/relgraph" element={<RelGraph />} />
        <Route path="/relstructure" element={<Structure />} />
      </Routes>
    </HashRouter>
  );
}
