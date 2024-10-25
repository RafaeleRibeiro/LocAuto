import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

function VehicleList() {
  const { patioId } = useParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [userId] = useState("3fa85f64-5717-4562-b3fc-2c963f66afa6"); // Substitua com o ID do cliente atual

  // Estado para os dados da locação
  const [dataLocacao, setDataLocacao] = useState(new Date().toISOString());
  const [dataDevolucao, setDataDevolucao] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('https://localhost:7094/api/Veiculos');
        const filteredVehicles = response.data.filter(vehicle => vehicle.patioId === patioId);
        setVehicles(filteredVehicles);
      } catch (error) {
        console.error('Erro ao carregar os veículos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [patioId]);

  const handleShowModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVehicle(null);
    setDataDevolucao(''); // Limpa o campo de devolução
  };

  const handleReserve = async () => {
    try {
      // Cria a nova locação de acordo com o formato especificado
      const newLocacao = {
        dataLocacao: new Date(dataLocacao).toISOString(), // Formata para o padrão ISO
        dataDevolucao: dataDevolucao ? new Date(dataDevolucao).toISOString() : null, // Formata para o padrão ISO
        clienteId: userId,
        veiculoId: selectedVehicle.veiculoId,
      };

      // Envia a locação para a API
      await axios.post('https://192.168.1.58:7094/api/Locacoes', newLocacao);

      // Atualiza a disponibilidade do veículo localmente
      setVehicles(prevVehicles =>
        prevVehicles.map(vehicle =>
          vehicle.veiculoId === selectedVehicle.veiculoId ? { ...vehicle, disponivel: false } : vehicle
        )
      );

      alert("Veículo reservado com sucesso!");
      handleCloseModal(); // Fecha o modal após a reserva
    } catch (error) {
      console.error("Erro ao reservar o veículo:", error);
      alert("Erro ao reservar o veículo. Tente novamente.");
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h2>Veículos no Pátio {patioId}</h2>
      <div className="row">
        {vehicles.length > 0 ? (
          vehicles.map(vehicle => (
            <div key={vehicle.veiculoId} className="col-md-4">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">{vehicle.modelo}</h5>
                  <p className="card-text">Marca: {vehicle.marca}</p>
                  <p className="card-text">Ano: {vehicle.ano}</p>
                  <p className="card-text">Disponível: {vehicle.disponivel ? 'Sim' : 'Não'}</p>
                  {vehicle.disponivel && (
                    <Button
                      variant="primary"
                      onClick={() => handleShowModal(vehicle)}
                    >
                      Reservar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum veículo disponível neste pátio.</p>
        )}
      </div>

      {/* Modal de Reservar Veículo */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Reservar Veículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="dataLocacao">
              <Form.Label>Data de Locação</Form.Label>
              <Form.Control
                type="datetime-local"
                value={dataLocacao}
                onChange={(e) => setDataLocacao(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="dataDevolucao">
              <Form.Label>Data de Devolução (opcional)</Form.Label>
              <Form.Control
                type="datetime-local"
                value={dataDevolucao}
                onChange={(e) => setDataDevolucao(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleReserve}>
            Confirmar Reserva
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default VehicleList;
