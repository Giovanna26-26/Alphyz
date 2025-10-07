import React, { useEffect, useState } from "react";
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
    estado: "",
    cidade: "",
    cpf: "",
    email: "",
    senha: "",
    termos: false,
    privacidade: false,
  });

  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(false);
  const [loadingCidades, setLoadingCidades] = useState(false);

  // Fallback simples (caso a API falhe)
  const cidadesFallback = {
    SP: ["São Paulo", "Campinas", "Santos", "São José dos Campos", "Ribeirão Preto"],
    RJ: ["Rio de Janeiro", "Niterói", "Petrópolis", "Volta Redonda", "Campos dos Goytacazes"],
    MG: ["Belo Horizonte", "Uberlândia", "Juiz de Fora", "Contagem", "Uberaba"],
    ES: ["Vitória", "Vila Velha", "Serra", "Cariacica", "Guarapari"],
  };

  // Carrega estados ao montar
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        setLoadingEstados(true);
        const res = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
        );
        const data = await res.json();
        // data: [{id, sigla, nome}, ...]
        setEstados(data);
      } catch (e) {
        console.error("Falha ao carregar estados do IBGE:", e);
        // Fallback básico com o Sudeste
        setEstados([
          { sigla: "ES", nome: "Espírito Santo" },
          { sigla: "MG", nome: "Minas Gerais" },
          { sigla: "RJ", nome: "Rio de Janeiro" },
          { sigla: "SP", nome: "São Paulo" },
        ]);
      } finally {
        setLoadingEstados(false);
      }
    };
    fetchEstados();
  }, []);

  // Quando mudar o estado, zera cidade e carrega novas
  useEffect(() => {
    if (!formData.estado) {
      setCidades([]);
      return;
    }
    const fetchCidades = async () => {
      try {
        setLoadingCidades(true);
        const uf = formData.estado; // ex.: "SP"
        const res = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`
        );
        const data = await res.json();
        // data: [{id, nome}, ...]
        setCidades(data.map((c) => c.nome));
      } catch (e) {
        console.error("Falha ao carregar cidades do IBGE:", e);
        setCidades(cidadesFallback[formData.estado] || []);
      } finally {
        setLoadingCidades(false);
      }
    };
    // limpa a cidade atual antes de carregar
    setFormData((prev) => ({ ...prev, cidade: "" }));
    fetchCidades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.estado]);

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
        {/* Coluna ESQUERDA */}
        <div className="col">
          <label>Nome completo</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} />

          <label>Telefone</label>
          <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} />

          <label>Rua</label>
          <input type="text" name="rua" value={formData.rua} onChange={handleChange} />

          <label>Número</label>
          <input type="text" name="numero" value={formData.numero} onChange={handleChange} />

          <label>Complemento (Opcional)</label>
          <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} />

          <label>CEP</label>
          <input type="text" name="cep" value={formData.cep} onChange={handleChange} />
        </div>

        {/* Coluna DIREITA */}
        <div className="col">
          {/* Estado e Cidade lado a lado */}
          <div className="field-row">
            <div className="field">
              <label>Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                disabled={loadingEstados}
              >
                <option value="">{loadingEstados ? "Carregando..." : "Selecione uma opção"}</option>
                {estados.map((uf) => (
                  <option key={uf.sigla} value={uf.sigla}>
                    {uf.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Cidade</label>
              <select
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                disabled={!formData.estado || loadingCidades}
              >
                <option value="">
                  {!formData.estado
                    ? "Selecione um estado"
                    : loadingCidades
                    ? "Carregando..."
                    : "Selecione uma opção"}
                </option>
                {cidades.map((nome) => (
                  <option key={nome} value={nome}>
                    {nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label>CPF</label>
          <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} />

          <label>E-mail</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />

          <label>Senha</label>
          <input type="password" name="senha" value={formData.senha} onChange={handleChange} />

          <label className="checkbox">
            <input
              type="checkbox"
              name="termos"
              checked={formData.termos}
              onChange={handleChange}
            />
            <span>Confirmo que li e concordo com os termos de uso</span>
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              name="privacidade"
              checked={formData.privacidade}
              onChange={handleChange}
            />
            <span>Confirmo que li e estou ciente sobre a Política de privacidade</span>
          </label>

          <button type="submit" className="btn-enviar">Enviar</button>

          <p className="voltar-login">
            <Link to="/">Já possuo conta (fazer login)</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
