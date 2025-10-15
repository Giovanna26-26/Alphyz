import React, { useEffect, useState } from "react";
import "../cadastro/cadastro.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { postJSON } from "../../services/api";



export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
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
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [cepErro, setCepErro] = useState("");

  // Fallback simples (caso a API do IBGE falhe)
  const cidadesFallback = {
    SP: ["São Paulo", "Campinas", "Santos", "São José dos Campos", "Ribeirão Preto"],
    RJ: ["Rio de Janeiro", "Niterói", "Petrópolis", "Volta Redonda", "Campos dos Goytacazes"],
    MG: ["Belo Horizonte", "Uberlândia", "Juiz de Fora", "Contagem", "Uberaba"],
    ES: ["Vitória", "Vila Velha", "Serra", "Cariacica", "Guarapari"],
  };

  // Carrega ESTADOS (IBGE)
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        setLoadingEstados(true);
        const res = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
        );
        const data = await res.json(); // [{id, sigla, nome}]
        setEstados(data);
      } catch {
        // Sudeste como fallback
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

  // Carrega CIDADES quando muda o ESTADO
  useEffect(() => {
    if (!formData.estado) {
      setCidades([]);
      return;
    }
    const fetchCidades = async () => {
      try {
        setLoadingCidades(true);
        const res = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.estado}/municipios?orderBy=nome`
        );
        const data = await res.json(); // [{id, nome}]
        const nomes = data.map((c) => c.nome);
        setCidades(nomes);

        // Se já houver uma cidade setada (p.ex. vinda do CEP), mantém
        // desde que exista na lista recém-carregada.
        if (formData.cidade && !nomes.includes(formData.cidade)) {
          setFormData((prev) => ({ ...prev, cidade: "" }));
        }
      } catch {
        const nomes = cidadesFallback[formData.estado] || [];
        setCidades(nomes);
      } finally {
        setLoadingCidades(false);
      }
    };
    fetchCidades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.estado]);

  // Helpers CEP
  const onlyDigits = (v) => v.replace(/\D/g, "");
  const formatCEP = (v) => {
    const d = onlyDigits(v).slice(0, 8);
    if (d.length <= 5) return d;
    return `${d.slice(0, 5)}-${d.slice(5)}`;
  };

  // Busca CEP na ViaCEP e preenche Rua/UF/Cidade
  const lookupCEP = async (cepDigits) => {
    if (cepDigits.length !== 8) return;
    try {
      setLoadingCEP(true);
      setCepErro("");
      const res = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepErro("CEP não encontrado.");
        return;
      }

      const uf = data.uf || "";
      const cidade = data.localidade || "";
      const rua = data.logradouro || "";

      setFormData((prev) => ({
        ...prev,
        rua,
        estado: uf,
        cidade,
      }));
      // O efeito de "estado" carregará a lista de cidades;
      // mantemos o valor já preenchido em 'cidade'.
    } catch {
      setCepErro("Não foi possível buscar o CEP. Tente novamente.");
    } finally {
      setLoadingCEP(false);
    }
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "cep") {
      const digits = onlyDigits(value);
      setFormData((prev) => ({ ...prev, cep: digits }));
      // Busca automática ao atingir 8 dígitos
      if (digits.length === 8) lookupCEP(digits);
      else setCepErro("");
      return;
    }

    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // validação mínima
    if (!formData.nome || !formData.email || !formData.senha) {
      alert("Preencha nome, e-mail e senha.");
      return;
    }
    if (!formData.termos || !formData.privacidade) {
      alert("Confirme os termos e a política de privacidade.");
      return;
    }

    // monta payload pro backend (mapeando rua -> endereco)
    const payload = {
      nome: formData.nome?.trim(),
      telefone: onlyDigits(formData.telefone),
      cep: onlyDigits(formData.cep),
      endereco: (formData.endereco || formData.rua || "").trim(),
      numero: formData.numero?.trim(),
      complemento: formData.complemento?.trim(),
      estado: formData.estado,
      cidade: formData.cidade,
      cpf: onlyDigits(formData.cpf),
      email: formData.email?.trim(),
      senha: formData.senha
    };

    await postJSON("/api/cadastros", payload);
    alert("Cadastro realizado com sucesso!");

    // limpa o form
    setFormData({
      nome: "",
      telefone: "",
      cep: "",
      rua: "",
      numero: "",
      complemento: "",
      estado: "",
      cidade: "",
      cpf: "",
      email: "",
      senha: "",
      termos: false,
      privacidade: false
    });
  } catch (err) {
    const msg = typeof err?.message === "string" ? err.message : "Falha ao cadastrar.";
    alert(msg);
  }
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

          {/* CEP logo abaixo do telefone */}
          <label>CEP</label>
          <input
            type="text"
            name="cep"
            value={formatCEP(formData.cep)}
            onChange={handleChange}
            onBlur={() => {
              const d = onlyDigits(formData.cep);
              if (d.length === 8) lookupCEP(d);
            }}
            placeholder="00000-000"
          />
          <small className={`hint ${cepErro ? "error" : ""}`}>
            {loadingCEP ? "Buscando CEP..." : cepErro || "Preencha para autocompletar endereço"}
          </small>

          <label>Rua</label>
          <input type="text" name="rua" value={formData.rua} onChange={handleChange} />

          <label>Número</label>
          <input type="text" name="numero" value={formData.numero} onChange={handleChange} />

          <label>Complemento (Opcional)</label>
          <input
            type="text"
            name="complemento"
            value={formData.complemento}
            onChange={handleChange}
          />
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
