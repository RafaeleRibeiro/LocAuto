import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BsGeoAlt, BsCalendar, BsClock, BsPerson } from 'react-icons/bs';

const HomePage = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLot, setSelectedLot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVeiculos = async () => {
      try {
        const response = await fetch('https://192.168.1.58:7094/api/Veiculos');
        const data = await response.json();
        setVeiculos(data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar os veículos:', err);
        setError('Falha ao carregar os veículos. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchVeiculos();
  }, []);

  const getStatusVariant = (disponivel) => {
    if (disponivel > 5) return 'success';
    if (disponivel > 0) return 'warning';
    return 'danger';
  };

  const getStatusText = (disponivel) => {
    if (disponivel > 5) return 'Disponível';
    if (disponivel > 0) return 'Disp. Reduzida';
    return 'Esgotado';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('https://192.168.1.58:7094/api/Veiculos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Dados do veículo (modelo, marca, ano, disponivel, patioId)
          // ...
        }),
      });

      if (response.ok) {
        // Atualizar a lista de veículos
        const newVeiculo = await response.json();
        setVeiculos([...veiculos, newVeiculo]);
        // Limpar os campos do formulário
        setSelectedLot('');
        setSelectedDate('');
        setSelectedTime('');
      } else {
        setError('Erro ao cadastrar o veículo.');
      }
    } catch (err) {
      console.error('Erro ao cadastrar o veículo:', err);
      setError('Erro ao cadastrar o veículo. Por favor, tente novamente mais tarde.');
    }
  };

  const handleLocacao = async (veiculoId, dias) => {
    try {
      const response = await fetch('https://192.168.1.58:7094/api/locacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          veiculoId: veiculoId,
          dias: dias,
        }),
      });

      if (response.ok) {
        // Obter o preço total da locação
        const locacao = await response.json();
        const precoTotal = locacao.precoTotal; // Assuma que o backend retorna o preço total

        // Atualizar a lista de veículos (se o backend atualizar o estado)
        const updatedVeiculos = veiculos.map((veiculo) => {
          if (veiculo.id === veiculoId) {
            return { ...veiculo, disponivel: veiculo.disponivel - 1 }; // Atualizar a quantidade disponível
          }
          return veiculo;
        });
        setVeiculos(updatedVeiculos);

        // Redirecionar para a página de confirmação da locação
        // ...
      } else {
        setError('Erro ao realizar a locação.');
      }
    } catch (err) {
      console.error('Erro ao realizar a locação:', err);
      setError('Erro ao realizar a locação. Por favor, tente novamente mais tarde.');
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="bg-light min-vh-100">
      <header className="py-3 mb-4 border-bottom">
        <Container className="d-flex justify-content-between align-items-center">
          <h1 className="h4 mb-0">LOCAUTO</h1>
          <Link to="/Cadastro">
            <Button variant="outline-secondary" className="rounded-circle">
              <BsPerson />
            </Button>
          </Link>
        </Container>
      </header>

      <Container>
        {/* Formulário para adicionar veículo */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={4} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label>Modelo</Form.Label>
                    <Form.Control type="text" placeholder="Modelo do veículo" required />
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label>Marca</Form.Label>
                    <Form.Control type="text" placeholder="Marca do veículo" required />
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label>Ano</Form.Label>
                    <Form.Control type="number" placeholder="Ano do veículo" required />
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label>Disponível</Form.Label>
                    <Form.Control type="number" placeholder="Quantidade disponível" required />
                  </Form.Group>
                </Col>
                <Col md={4} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label>Pátio ID</Form.Label>
                    <Form.Control type="number" placeholder="ID do pátio" required />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Button variant="primary" type="submit">
                    Adicionar Veículo
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Row>
              <Col md={4} className="mb-3 mb-md-0">
                <div className="d-flex align-items-center mb-2">
                  <BsGeoAlt className="me-2" />
                  <span>Escolha o pátio de sua preferência</span>
                </div>
                <div className="d-flex align-items-center">
                  <input type="text" className="form-control" placeholder="Selecione o pátio"
                    value={selectedLot}
                    onChange={(e) => setSelectedLot(e.target.value)}
                  />
                </div>
              </Col>
              <Col md={4} className="mb-3 mb-md-0">
                <div className="d-flex align-items-center mb-2">
                  <BsCalendar className="me-2" />
                  <span>Escolha a data</span>
                </div>
                <div className="d-flex align-items-center">
                  <input type="date" className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </Col>
              <Col md={4}>
                <div className="d-flex align-items-center mb-2">
                  <BsClock className="me-2" />
                  <span>Escolha o horário</span>
                </div>
                <div className="d-flex align-items-center">
                  <input type="time" className="form-control"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Row xs={1} md={2} lg={4} className="g-4">
          {veiculos.map((veiculo) => (
            <Col key={veiculo.id}>
              <Card className="h-100 shadow-sm">
                <Card.Img variant="top" src={veiculo.imagemUrl || "/placeholder.svg?height=180&width=286"} alt={veiculo.modelo} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-center mb-4">
                    {veiculo.modelo}
                  </Card.Title>
                  {/* Adicionar um campo para a quantidade de dias */}
                  <Form.Group className="mb-3">
                    <Form.Label>Quantidade de dias:</Form.Label>
                    <Form.Control type="number" min="1" />
                  </Form.Group>
                  <Button
                    variant={getStatusVariant(veiculo.quantidadeDisponivel)}
                    className="mb-2"
                    disabled={veiculo.quantidadeDisponivel === 0}
                    onClick={() => handleLocacao(veiculo.id, /* quantidade de dias */)} // Chame handleLocacao com a quantidade de dias desejada
                  >
                    {getStatusText(veiculo.quantidadeDisponivel)}
                  </Button>
                  {/* ... (seu código anterior) ... */}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default HomePage;