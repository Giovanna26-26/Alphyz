import React from "react";
import "./shopping.css";
import { FaShoppingCart, FaSlidersH, FaSearch } from "react-icons/fa";
import logo from "../../assets/logo.png";
import pergunta from "../../assets/pergunta.png";
import chat from "../../assets/chat.png";
import fita from "../../assets/fita.png";

export default function Shopping() {
  const recomendados = [
    { nome: "Top Rosa", preco: "R$129,90", tamanho: "M", img: "/blusarosa.jpg" },
    { nome: "Regata Cinza", preco: "R$59,90", tamanho: "M", img: "/blusacinza.png" },
    { nome: "Blusa Floral", preco: "R$149,90", tamanho: "M", img: "/blusafloral.png" },
    { nome: "Vestido Preto", preco: "R$89,90", tamanho: "M", img: "/vestidopreto.png" },
    { nome: "Bermuda Rosa", preco: "R$79,90", tamanho: "M", img: "/bermudarosa.jpg" },
     { nome: "Blusa Preta", preco: "R$79,90", tamanho: "M", img: "/blusapreta.png" },
      { nome: "Regata Amarela", preco: "R$79,90", tamanho: "M", img: "/regataamarela.png" },

  ];

  const primavera = [
    { nome: "Vestido Floral Colorido", preco: "R$179,90", img: "" },
    { nome: "Macacão Preto", preco: "R$199,90", img: "" },
    { nome: "Vestido Branco", preco: "R$149,90", img: "" },
    { nome: "Vestido Azul", preco: "R$169,90", img: "" },
  ];

  const destaque = [
    { nome: "Camiseta Branca", preco: "R$69,90", img: "" },
    { nome: "Camiseta Preta", preco: "R$69,90", img: "" },
    { nome: "Camiseta Cinza", preco: "R$79,90", img: "" },
    { nome: "Camisa Xadrez", preco: "R$99,90", img: "" },
  ];

  const renderProdutos = (produtos) =>
    produtos.map((p, i) => (
      <div className="produto-card" key={i}>
        <div className="produto-imagem">
          {p.img ? (
            <img src={p.img} alt={p.nome} />
          ) : (
            <div className="imagem-placeholder">Imagem</div>
          )}
        </div>
        <div className="produto-info">
          <p className="produto-nome">{p.nome}</p>
          <div className="produto-tamanho-fita">
            <button className="btn-icon">
              <img src={fita} alt="Salvar" />
            </button>
          </div>
          <p className="produto-preco">{p.preco}</p>
        </div>
      </div>
    ));

  const scrollLeft = (id) => {
    const container = document.getElementById(id);
    container.scrollBy({ left: -220, behavior: "smooth" });
  };

  const scrollRight = (id) => {
    const container = document.getElementById(id);
    container.scrollBy({ left: 220, behavior: "smooth" });
  };

  return (
    <>
      {/* ---------- HEADER / MENU ---------- */}
      <header className="header">
        <div className="header-logo">
          <img src={logo} alt="logo alphyz" />
        </div>

        <div className="header-search">
          <FaSlidersH className="search-icon-left" />
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="O que você está buscando?"
              className="search-input"
            />
            <FaSearch className="search-icon-right" />
          </div>
        </div>

        <div className="header-right">
          <a href="#" className="header-link">SOBRE NÓS</a>
          <img src={pergunta} className="header-icon" />
          <img src={chat} className="header-icon" />
          <FaShoppingCart className="header-icon" />
          <a href="#" className="header-login">LOGIN</a>
          <button className="header-btn">CADASTRE-SE</button>
        </div>
      </header>

      <div className="shopping-container">
        {/* Seção Recomendações */}
        <section className="secao">
          <h2>RECOMENDADOS</h2>
          <div className="carousel-container">
            <button className="carousel-arrow left" onClick={() => scrollLeft("recomendados")}>
              &#10094;
            </button>
            <div className="carousel" id="recomendados">
              {renderProdutos(recomendados)}
            </div>
            <button className="carousel-arrow right" onClick={() => scrollRight("recomendados")}>
              &#10095;
            </button>
          </div>
        </section>

        {/* Seção Primavera */}
        <section className="secao">
          <h2>PARA PRIMAVERA</h2>
          <div className="carousel-container">
            <button className="carousel-arrow left" onClick={() => scrollLeft("primavera")}>
              &#10094;
            </button>
            <div className="carousel" id="primavera">
              {renderProdutos(primavera)}
            </div>
            <button className="carousel-arrow right" onClick={() => scrollRight("primavera")}>
              &#10095;
            </button>
          </div>
        </section>

        {/* Seção Destaque */}
        <section className="secao">
          <h2>DESTAQUE DO DIA</h2>
          <div className="carousel-container">
            <button className="carousel-arrow left" onClick={() => scrollLeft("destaque")}>
              &#10094;
            </button>
            <div className="carousel" id="destaque">
              {renderProdutos(destaque)}
            </div>
            <button className="carousel-arrow right" onClick={() => scrollRight("destaque")}>
              &#10095;
            </button>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#">Termos de uso</a>
          <a href="#">Política de privacidade</a>
          <a href="#">Contato: alphyz@gmail.com</a>
          <a href="#">FAQ</a>
        </div>
        <p>© 2025 Alphyz. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}