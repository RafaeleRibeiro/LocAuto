import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from "react-bootstrap";

function PatioList() {
  const [patios, setPatios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://192.168.1.58:7094/api/Patios")
      .then((response) => {
        setPatios(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar os pátios", error);
        setError("Falha ao carregar os pátios. Por favor, tente novamente mais tarde.");
        setLoading(false);
      });
  }, []);

  const getAvailabilityInfo = (availableCars) => {
    if (availableCars > 5) return { color: "success", text: "Normal" };
    if (availableCars > 2) return { color: "warning", text: "Baixa" };
    return { color: "danger", text: "Crítica" };
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Lista de Pátios</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {patios.map((patio) => {
          const { color, text } = getAvailabilityInfo(patio.availableCars);
          return (
            <Col key={patio.patioId}>
              <Card className="h-100 shadow-sm hover-effect">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="d-flex justify-content-between align-items-center mb-3">
                    <span>{patio.nome}</span>
                    <Badge bg={color} pill>
                      {text}
                    </Badge>
                  </Card.Title>
                  <Card.Text>
                    <i className="bi bi-car-front me-2"></i>
                    {patio.availableCars} veículos disponíveis
                  </Card.Text>
                  <Button
                    as={Link}
                    to={`/patios/${patio.patioId}/veiculos`}
                    variant="primary"
                    className="mt-auto"
                  >
                    <i className="bi bi-eye me-2"></i>
                    Ver veículos
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default PatioList;