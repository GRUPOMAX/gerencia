import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EditSection.module.css";

function EditSection({ currentCompany }) {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");

  useEffect(() => {
    if (currentCompany) {
      axios
        .get(`https://api.dashboard.admin.nexusnerds.com.br/api/${currentCompany}-links`)
        .then((response) => {
          setSections(response.data.sections || []);
        })
        .catch((error) => console.error("Erro ao buscar seções:", error));
    }
  }, [currentCompany]);

  const handleSelectChange = (e) => {
    setSelectedSection(e.target.value);
    setNewSectionTitle(e.target.value);
  };

  const handleSave = () => {
    if (!selectedSection || !newSectionTitle) {
      alert("Selecione e edite um nome para salvar.");
      return;
    }

    axios
      .put(`https://api.dashboard.admin.nexusnerds.com.br/api/${currentCompany}/edit-section`, {
        oldTitle: selectedSection,
        newTitle: newSectionTitle,
      })
      .then(() => {
        alert("Seção editada com sucesso!");
        setSections((prev) =>
          prev.map((sec) =>
            sec.title === selectedSection ? { ...sec, title: newSectionTitle } : sec
          )
        );
        setSelectedSection("");
        setNewSectionTitle("");
      })
      .catch((error) => console.error("Erro ao editar seção:", error));
  };

  return (
    <div className={styles.wrapper}>
      <h2>Editar Seção</h2>
      <div className={styles.formGroup}>
        <label>Selecione a Seção</label>
        <select value={selectedSection} onChange={handleSelectChange}>
          <option value="">Escolha uma seção</option>
          {sections.map((sec) => (
            <option key={sec.title} value={sec.title}>
              {sec.title}
            </option>
          ))}
        </select>
      </div>

      {selectedSection && (
        <>
          <div className={styles.formGroup}>
            <label>Novo Nome da Seção</label>
            <input
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
            />
          </div>

          <button className={styles.saveButton} onClick={handleSave}>
            Salvar Alterações
          </button>
        </>
      )}
    </div>
  );
}

export default EditSection;
