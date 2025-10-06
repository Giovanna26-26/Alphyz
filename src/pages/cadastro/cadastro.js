import React, { useState } from "react";
import "../cadastro/cadastro.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    rua: "",
    numero: "",
    complemento: "",
    cep: "",
    rg: "",
    cpf: "",
    email: "",
    senha: "",
    termos: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados enviados:", formData);
    alert("Cadastro enviado com sucesso!");
  };

  return (
    <div className="cadastro-container">
      <h2 className="cadastro-title">
  <span>Seja bem-vindo a</span>
  <img src={logo} alt="alphyz" className="cadastro-title__logo" />
  <span>!</span>
</h2>
      <form onSubmit={handleSubmit} className="cadastro-form">
        <div className="col">
          <label>Nome completo:</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} />

          <label>Telefone:</label>
          <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} />

          <label>Rua:</label>
          <input type="text" name="rua" value={formData.rua} onChange={handleChange} />

          <label>Número:</label>
          <input type="text" name="numero" value={formData.numero} onChange={handleChange} />

          <label>Complemento (Opcional):</label>
          <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} />

          <label>CEP:</label>
          <input type="text" name="cep" value={formData.cep} onChange={handleChange} />
        </div>

        <div className="col">
          <label>RG:</label>
          <input type="text" name="rg" value={formData.rg} onChange={handleChange} />

          <label>CPF:</label>
          <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} />

          <label>E-mail:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />

          <label>Senha:</label>
          <input type="password" name="senha" value={formData.senha} onChange={handleChange} />

          <div className="termos">
            <input
              type="checkbox"
              name="termos"
              checked={formData.termos}
              onChange={handleChange}
            />
            <span>Confirmo que li e concordo com os termos de uso</span>
          </div>

          <button type="submit" className="btn-enviar">
            Enviar
          </button>

          <p className="voltar-login">
  <Link to="/">Já possuo conta (fazer login)</Link>
</p>
        </div>
      </form>
    </div>
  );
}