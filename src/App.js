import React, { useState } from "react";
import { HashRouter as Router, Route, Switch, Link } from "react-router-dom";
import CompanySelector from "./components/CompanySelector";
import LinkForm from "./components/LinkForm";
import DeletePage from "./components/DeletePage";
import EditSection from "./components/EditSection";
import EditShortcut from "./components/EditShortcut";
import "./App.css";

function App() {
  const [currentCompany, setCurrentCompany] = useState("Max"); // Define um estado para a empresa atual
  const [linksData, setLinksData] = useState({}); // Armazena os dados dos links

  return (
    <Router> {/* Agora usando HashRouter para evitar erro 404 */}
      <div className="app">
        <CompanySelector setCurrentCompany={setCurrentCompany} />

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/delete">Gerenciar Departamentos e Seções</Link>
          <Link to="/edit-sections">Editar Seções</Link>
          <Link to="/edit-shortcuts">Editar Atalhos</Link>
        </nav>

        <Switch>
          <Route exact path="/" render={() => <LinkForm currentCompany={currentCompany} setLinksData={setLinksData} />} />
          <Route path="/delete" render={() => <DeletePage currentCompany={currentCompany} />} />
          <Route path="/edit-sections" render={() => <EditSection currentCompany={currentCompany} />} />
          <Route path="/edit-shortcuts" render={() => <EditShortcut currentCompany={currentCompany} />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
