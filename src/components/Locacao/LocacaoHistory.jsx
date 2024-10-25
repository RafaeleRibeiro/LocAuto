import React, { useState, useEffect } from "react";
import axios from "axios";

function LocacaoHistory() {
  const [locacoes, setLocacoes] = useState([]);

  useEffect(() => {
    axios
      .get("https://192.168.1.58:7094/api/Locacaos")
      .then((response) => {
        setLocacoes(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar o histórico de locações", error);
      });
  }, []);

  return (
    <div>
      <h2>Histórico de Locações</h2>
      <ul className="list-group">
        {locacoes.map((locacao) => (
          <li key={locacao.locacaoId} className="list-group-item">
            Cliente: {locacao.cliente.nome} | Veículo: {locacao.veiculo.modelo}{" "}
            | Data Locação: {new Date(locacao.dataLocacao).toLocaleDateString()}{" "}
            |{" "}
            {locacao.dataDevolucao
              ? `Devolvido em: ${new Date(
                  locacao.dataDevolucao
                ).toLocaleDateString()}`
              : "Em uso"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocacaoHistory;
