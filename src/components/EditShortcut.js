import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Editor de texto para popupText
import styles from "./EditShortcut.module.css";

function EditShortcut({ currentCompany }) {
  const [shortcuts, setShortcuts] = useState([]);
  const [selectedShortcut, setSelectedShortcut] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    url: "",
    imgSrc: "",
    altText: "",
    text: "",
    popupText: ""
  });

  useEffect(() => {
    if (currentCompany) {
      axios
        .get(`https://api.dashboard.admin.nexusnerds.com.br/api/${currentCompany}-links`)
        .then((response) => {
          const allShortcuts = response.data.sections.flatMap((sec) => sec.links);
          setShortcuts(allShortcuts);
        })
        .catch((error) => console.error("Erro ao buscar atalhos:", error));
    }
  }, [currentCompany]);

  const handleSelectChange = (e) => {
    const shortcut = shortcuts.find((s) => s.id === e.target.value);
    setSelectedShortcut(shortcut);
    setFormData(shortcut || {});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePopupChange = (value) => {
    setFormData((prev) => ({ ...prev, popupText: value }));
  };

  const handleSave = () => {
    if (!selectedShortcut) {
      alert("Selecione um atalho para editar.");
      return;
    }

    axios
      .put(`https://api.dashboard.admin.nexusnerds.com.br/api/${currentCompany}/edit-shortcut`, {
        oldId: selectedShortcut.id,
        updatedShortcut: formData
      })
      .then(() => {
        alert("Atalho editado com sucesso!");
        setShortcuts((prev) =>
          prev.map((s) => (s.id === selectedShortcut.id ? formData : s))
        );
        setSelectedShortcut(null);
        setFormData({
          id: "",
          url: "",
          imgSrc: "",
          altText: "",
          text: "",
          popupText: ""
        });
      })
      .catch((error) => console.error("Erro ao editar atalho:", error));
  };

  // 🔥 Função para excluir um atalho
  const handleDelete = () => {
    if (!selectedShortcut) return;

    const confirmDelete = window.confirm(`Tem certeza que deseja excluir o atalho "${selectedShortcut.text}"?`);
    if (!confirmDelete) return;

    axios
      .delete(`https://api.dashboard.admin.nexusnerds.com.br/api/${currentCompany}/delete-shortcut`, {
        data: { id: selectedShortcut.id }
      })
      .then(() => {
        alert("Atalho excluído com sucesso!");
        setShortcuts((prev) => prev.filter((s) => s.id !== selectedShortcut.id));
        setSelectedShortcut(null);
        setFormData({
          id: "",
          url: "",
          imgSrc: "",
          altText: "",
          text: "",
          popupText: ""
        });
      })
      .catch((error) => console.error("Erro ao excluir atalho:", error));
  };

  return (
    <div className={styles.wrapper}>
      <h2>Editar Atalho</h2>
      <div className={styles.formGroup}>
        <label>Selecione o Atalho</label>
        <select
            className={styles.selectShortcut}  
            value={selectedShortcut?.id || ""}
            onChange={handleSelectChange}
        >
            <option value="">Escolha um atalho</option>
            {shortcuts.map((s) => (
            <option key={s.id} value={s.id}>
                {s.text}
            </option>
            ))}
        </select>
      </div>

      {selectedShortcut && (
        <>
          <div className={styles.formGroup}>
            <label>ID</label>
            <input type="text" name="id" value={formData.id} onChange={handleChange} readOnly />
          </div>

          <div className={styles.formGroup}>
            <label>URL</label>
            <input type="text" name="url" value={formData.url} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label>Imagem (URL)</label>
            <input type="text" name="imgSrc" value={formData.imgSrc} onChange={handleChange} />
          </div>
            {/* Pré-visualização da imagem */}
            <div className={styles.imagePreview}>
                {formData.imgSrc ? (
                <img src={formData.imgSrc} alt="Pré-visualização" />
                ) : (
                <span>Insira uma URL para visualizar</span>
                )}
            </div>

          <div className={styles.formGroup}>
            <label>Alt Text</label>
            <input type="text" name="altText" value={formData.altText} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label>Texto</label>
            <input type="text" name="text" value={formData.text} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label>Popup Text</label>
            <ReactQuill
              theme="snow"
              value={formData.popupText}
              onChange={handlePopupChange}
              className={styles.quillEditor}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.saveButton} onClick={handleSave}>
              Salvar Alterações
            </button>
            <button className={styles.deleteButton} onClick={handleDelete}>
              Excluir Atalho
            </button>
          </div>
        </>
      )}
      
    </div>
    
  );
}

export default EditShortcut;
