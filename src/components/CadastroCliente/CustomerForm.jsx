import React, { useState } from "react";
import "./CustomerForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CustomerForm() {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("https://192.168.1.58:7094/api/Clientes", formData)
      .then(() => {
        navigate("/"); // Retorna para a página inicial após o cadastro
      })
      .catch((error) => {
        console.error("Erro ao cadastrar cliente", error);
      });
  };

  return (
    <div className="customer-form-container">
      <div className="form-container">
        <h1 id="form-title">Seja bem-vindo a LocAuto!</h1>
        <h2 id="form-subtitle">Faça seu cadastro:</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cpf">CPF</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input
              type="text"
              id="telefone"
              name="telefone"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            ENTRAR
          </button>
        </form>
      </div>
    </div>
  );
}

export default CustomerForm;