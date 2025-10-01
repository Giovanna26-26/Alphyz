import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login.js";
import Cadastro from "./pages/cadastro/cadastro.js";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} /> 
       <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}
