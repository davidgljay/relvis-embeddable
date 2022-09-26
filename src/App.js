
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
        <Route path="relvis-embeddable/reldefinition" element={<Definition />} />
        <Route path="relvis-embeddable/limitstoprediction" element={<Limits />} />
        <Route path="relvis-embeddable/relgraph" element={<RelGraph />} />
        <Route path="relvis-embeddable/relstructure" element={<Structure />} />
      </Routes>
    </HashRouter>
  );
}
