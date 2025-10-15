import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcryptjs";

const app = express();

// CORS
const origins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map(s => s.trim());
app.use(cors({ origin: origins, credentials: true }));

app.use(express.json());

// Conecta Mongo
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => { console.error("❌ Erro MongoDB:", err); process.exit(1); });

// Schema/Model
const CadastroSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: String,
  cep: String,
  endereco: String,
  cidade: String,
  estado: String,
  numero: String,
  complemento: String,
  cpf: String,
  email: { type: String, required: true, unique: true },
  senhaHash: { type: String, required: true }
}, { timestamps: true });

CadastroSchema.index({ email: 1 }, { unique: true });

const Cadastro = mongoose.model("Cadastro", CadastroSchema);

// Rotas
app.get("/api/health", (_, res) => res.json({ ok: true }));

app.post("/api/cadastros", async (req, res) => {
  try {
    // normalização (aceita "endereco" ou "rua" do front)
    const onlyDigits = (v) => String(v || "").replace(/\D/g, "");
    const nome  = (req.body?.nome  || "").trim();
    const email = (req.body?.email || "").toLowerCase().trim();
    const senha = String(req.body?.senha || "");

    if (!nome || !email || !senha) {
      return res.status(400).send("Campos obrigatórios: nome, email, senha.");
    }

    if (await Cadastro.exists({ email })) {
      return res.status(409).send("Email já cadastrado.");
    }

    const payload = {
      nome,
      telefone: onlyDigits(req.body?.telefone),
      cep: onlyDigits(req.body?.cep),
      endereco: (req.body?.endereco ?? req.body?.rua ?? "").trim(),
      cidade: req.body?.cidade || "",
      estado: req.body?.estado || "",
      numero: req.body?.numero ? String(req.body.numero) : "",
      complemento: req.body?.complemento || "",
      cpf: onlyDigits(req.body?.cpf),
      email,
      senhaHash: await bcrypt.hash(senha, 10)
    };

    const doc = await Cadastro.create(payload);
    return res.status(201).json({ id: doc._id });

  } catch (e) {
    // mensagens úteis durante o dev
    if (e?.code === 11000) return res.status(409).send("Email já cadastrado.");
    console.error("POST /api/cadastros ->", e);
    return res.status(500).send(`Erro ao salvar cadastro: ${e?.message || ""}`);
  }
});

// (opcional) login pra teste
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, senha } = req.body || {};
    const user = await Cadastro.findOne({ email });
    if (!user) return res.status(401).send("Credenciais inválidas.");
    const ok = await bcrypt.compare(senha || "", user.senhaHash);
    if (!ok) return res.status(401).send("Credenciais inválidas.");
    return res.json({ ok: true, id: user._id, nome: user.nome });
  } catch (e) {
    console.error(e);
    return res.status(500).send("Erro no login.");
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`🚀 API http://localhost:${port}`));
