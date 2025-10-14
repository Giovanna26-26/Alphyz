// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());


mongoose
  .connect("mongodb://localhost:27017/usuariosDB") 
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));


const usuarioSchema = new mongoose.Schema({
  nome: String,
  telefone: String,
  cep: String,
  rua: String,
  numero: String,
  complemento: String,
  estado: String,
  cidade: String,
  cpf: String,
  email: String,
  senha: String,
  termos: Boolean,
  privacidade: Boolean,
});

const Usuario = mongoose.model("Usuario", usuarioSchema);


app.post("/api/usuarios", async (req, res) => {
  try {
    const novoUsuario = new Usuario(req.body);
    await novoUsuario.save();
    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao cadastrar usuário." });
  }
});

// 4️⃣ Rota para listar usuários (opcional para testes)
app.get("/api/usuarios", async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

// 5️⃣ Iniciando o servidor
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));