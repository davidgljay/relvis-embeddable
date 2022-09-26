
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Definition from "./pages/reldefinition";
import Limits from "./pages/limitstoprediction";
import RelGraph from "./pages/relgraph";
import Structure from "./pages/relstructure";
import Home from "./pages/home";
import './App.css';

export default function App() {
  let queryParams = new URLSearchParams(window.location.search);
  var vis = queryParams.get('vis')
  let component
  switch(vis) {
    case "reldefinition":
      return (<Definition/>);
      break;
    case "relgraph":
      return (<RelGraph/>);
      break;
    case "limitstoprediction":
      return (<Limits/>);
      break;
    case "relstructure":
      return (<Structure/>);
      break;
    default:
      return (<Home/>);
  }
}
