import React, { useState } from "react";
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
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nome</label>
        <input
          type="text"
          name="nome"
          className="form-control"
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>CPF</label>
        <input
          type="text"
          name="cpf"
          className="form-control"
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Telefone</label>
        <input
          type="text"
          name="telefone"
          className="form-control"
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          className="form-control"
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Cadastrar
      </button>
    </form>
  );
}

export default CustomerForm;
