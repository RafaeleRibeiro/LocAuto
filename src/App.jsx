import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import PatioList from "./components/Patio/PatioList";
import VehicleList from "./components/Veiculos/VehicleList";
import CustomerForm from "./components/CadastroCliente/CustomerForm";
import LocacaoHistory from "./components/Locacao/LocacaoHistory";
import HomePage from "./components/Home/Home";

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/patios/:patioId/veiculos" element={<VehicleList />} />
          <Route path="/cadastro" element={<CustomerForm />} />
          <Route path="/historico" element={<LocacaoHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
