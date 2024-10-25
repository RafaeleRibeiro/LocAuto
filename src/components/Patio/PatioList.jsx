import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function PatioList() {
  const [patios, setPatios] = useState([]); // Define estado inicial como array vazio

  useEffect(() => {
    axios
      .get("https://192.168.1.58:7094/api/Patios")
      .then((response) => {
        setPatios(Array.isArray(response.data) ? response.data : []); // Garante que `patios` será um array
      })
      .catch((error) => {
        console.error("Erro ao carregar os pátios", error);
      });
  }, []);

  const getColor = (availableCars) => {
    if (availableCars > 5) return "available-normal"; // Verde
    if (availableCars > 2) return "available-low"; // Amarelo
    return "available-critical"; // Vermelho
  };

  return (
    <div className="row">
      {patios.map((patio) => (
        <div className="col-md-4" key={patio.patioId}>
          <div className={`card ${getColor(patio.availableCars)}`}>
            <div className="card-body">
              <h5>{patio.nome}</h5>
              <p>{patio.availableCars} veículos disponíveis</p>
              <Link
                to={`/patios/${patio.patioId}/veiculos`}
                className="btn btn-primary"
              >
                Ver veículos
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PatioList;
