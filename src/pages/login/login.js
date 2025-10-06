import React,{ useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../login/login.css";
import logo from "../../assets/logo.png";
import bg from "../../assets/login-bg.jpg";


export default function Login() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  const enviarFormulario = (e) => {
    e.preventDefault();
    console.log("Login:", login, "Senha:", senha);
  
  };
  const bgStyle = {
  backgroundImage: `url(${bg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  minHeight: "100vh",
};

  return (
    <div className="login-container">
      
      <div className="login-left" style={bgStyle}>
        
      </div>

      
      <div className="login-right">
        
        <form onSubmit={enviarFormulario} className="login-form">
           <img src={logo} alt="Logo" className="login-logo" />
          <h1>BEM-VINDO DE VOLTA!</h1>

          <label>Login</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <div className="links">

          </div>
          <button type="submit">Enviar</button>


          <div className="links">
          <a href="#">Esqueci a senha</a>
          <Link to="/cadastro">Ainda não sou cadastrado</Link>
          </div>
         

        </form>
      </div>
    </div>
  );
}