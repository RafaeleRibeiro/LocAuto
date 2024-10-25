import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Badge, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function LocacaoHistory() {
  const [locacoes, setLocacoes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locacoesRes, clientesRes, veiculosRes] = await Promise.all([
          axios.get("https://192.168.1.58:7094/api/Locacaos"),
          axios.get("https://192.168.1.58:7094/api/Clientes"),
          axios.get("https://192.168.1.58:7094/api/Veiculos"),
        ]);

        setLocacoes(locacoesRes.data);
        setClientes(clientesRes.data);
        setVeiculos(veiculosRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar os dados", error);
        setError(
          "Falha ao carregar os dados. Por favor, tente novamente mais tarde."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getClienteName = (clienteId) => {
    const cliente = clientes.find((c) => c.clienteId === clienteId);
    return cliente ? cliente.nome : "Cliente não encontrado";
  };

  const getVeiculoModelo = (veiculoId) => {
    const veiculo = veiculos.find((v) => v.veiculoId === veiculoId);
    return veiculo ? veiculo.marca : "Veículo não encontrado";
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <h1 className="text-center mb-5">Histórico de Locações</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {locacoes.map((locacao) => (
          <Col key={locacao.locacaoId}>
            <Card className="h-100 shadow-sm hover-effect">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center mb-3">
                  <i className="bi bi-car-front-fill text-primary fs-4"></i>
                  <Badge
                    bg={locacao.dataDevolucao ? "success" : "warning"}
                    pill
                  >
                    {locacao.dataDevolucao ? "Devolvido" : "Em uso"}
                  </Badge>
                </Card.Title>
                <Card.Text as="div">
                  <p className="mb-2 d-flex align-items-center">
                    <i className="bi bi-person-fill me-2 text-secondary"></i>
                    <strong>Cliente:</strong>{" "}
                    <span className="ms-1">
                      {getClienteName(locacao.clienteId)}
                    </span>
                  </p>
                  <p className="mb-2 d-flex align-items-center">
                    <i className="bi bi-car-front me-2 text-secondary"></i>
                    <strong>Veículo:</strong>{" "}
                    <span className="ms-1">
                      {getVeiculoModelo(locacao.veiculoId)}
                    </span>
                  </p>
                  <p className="mb-2 d-flex align-items-center">
                    <i className="bi bi-calendar-event me-2 text-secondary"></i>
                    <strong>Data Locação:</strong>{" "}
                    <span className="ms-1">
                      {new Date(locacao.dataLocacao).toLocaleDateString()}
                    </span>
                  </p>
                  {locacao.dataDevolucao && (
                    <p className="mb-2 d-flex align-items-center">
                      <i className="bi bi-check-circle-fill me-2 text-success"></i>
                      <strong>Devolvido em:</strong>{" "}
                      <span className="ms-1">
                        {new Date(locacao.dataDevolucao).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                </Card.Text>
                <Link
                  to={`/locacao/${locacao.locacaoId}`}
                  className="btn btn-primary mt-2"
                >
                  Ver Detalhes
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
