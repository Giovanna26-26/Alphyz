
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login.js";
import Cadastro from "./pages/cadastro/cadastro.js";
import Home from "./pages/home/home.js";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} /> 
       <Route path="/cadastro" element={<Cadastro />} />
       <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

