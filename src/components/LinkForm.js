import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Estilos do editor de texto
import styles from './LinkForm.module.css';



function LinkForm({ currentCompany, linksData, setLinksData }) {
  const [formData, setFormData] = useState({
    department: '',
    section: '',
    id: '',
    title: '',
    urlAccess: '',
    urlImage: '',
    popupText: ''
  });


  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [showPopupEditor, setShowPopupEditor] = useState(false);
  
  useEffect(() => {
    console.log("Estado do Popup Editor:", showPopupEditor);
  }, [showPopupEditor]);
  

  useEffect(() => {
    axios.get(`https://api.dashboard.admin.nexusnerds.com.br/api/${currentCompany}-links`)
      .then(response => {
        setLinksData(response.data);
        setDepartments(Object.keys(response.data.accessPermissions));
        setSections(response.data.sections.map(section => section.title));
      })
      .catch(error => console.error('Erro ao buscar dados:', error));
  }, [currentCompany, setLinksData]);


  useEffect(() => {
    if (formData.title.trim() !== '') {
      setFormData(prev => ({ 
        ...prev, 
        id: `ID-${formData.title.replace(/\s+/g, '-').toLowerCase()}` 
      }));
    }
  }, [formData.title]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePopupChange = (value) => {
    setFormData(prev => ({ ...prev, popupText: value }));
  };

  const handleAddDepartment = () => {
    const department = prompt("Digite o nome do novo departamento:");
    if (department && !departments.includes(department)) {
        axios.post(`https://api.dashboard.admin.nexusnerds.com.br/api/${currentCompany}/add-department`, { department })
            .then(response => {
                alert(response.data.message || response.data.error);
                setDepartments(prev => [...prev, department]);
                setFormData(prev => ({ ...prev, department })); // Atualiza o departamento selecionado
            })
            .catch(error => console.error('Erro ao adicionar departamento:', error));
    } else {
        alert("Departamento já existe ou entrada inválida!");
    }
};


const handleAddSection = () => {
    const sectionTitle = prompt("Digite o nome da nova seção:");
    if (sectionTitle && !sections.includes(sectionTitle)) {
        axios.post(`https://api.dashboard.admin.nexusnerds.com.br/api/${currentCompany}/add-section`, { sectionTitle })
            .then(response => {
                alert(response.data.message || response.data.error);
                setSections(prev => [...prev, sectionTitle]);
                setFormData(prev => ({ ...prev, section: sectionTitle })); // Atualiza a seção selecionada
            })
            .catch(error => console.error('Erro ao adicionar seção:', error));
    } else {
        alert("Seção já existe ou entrada inválida!");
    }
};


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.department || !formData.section || !formData.id || !formData.title || !formData.urlAccess || !formData.urlImage) {
        alert("Todos os campos são obrigatórios!");
        return;
    }

    const newEntry = {
        id: formData.id,
        url: formData.urlAccess,
        imgSrc: formData.urlImage,
        altText: formData.title,
        text: formData.title,
        ...(showPopupEditor && formData.popupText ? { popupText: formData.popupText } : {}) // Adiciona popupText apenas se o editor estiver ativo
    };

    axios.get(`https://api.dashboard.admin.nexusnerds.com.br/api/${currentCompany}-links`)
        .then(response => {
            const updatedData = { ...response.data };

            if (!updatedData.accessPermissions[formData.department]) {
                updatedData.accessPermissions[formData.department] = [];
            }
            if (!updatedData.accessPermissions[formData.department].includes(formData.id)) {
                updatedData.accessPermissions[formData.department].push(formData.id);
            }

            const sectionIndex = updatedData.sections.findIndex(sec => sec.title === formData.section);
            if (sectionIndex !== -1) {
                updatedData.sections[sectionIndex].links.push(newEntry);
            } else {
                alert("Seção não encontrada!");
                return;
            }

            return axios.put(`https://api.dashboard.admin.nexusnerds.com.br/api/${currentCompany}-links`, updatedData);
        })
        .then(() => {
            alert("Dados cadastrados com sucesso!");
            setFormData({
                department: '',
                section: '',
                id: '',
                title: '',
                urlAccess: '',
                urlImage: '',
                popupText: ''
            });
            setShowPopupEditor(false); // Resetar estado do editor
        })
        .catch(error => {
            console.error('Erro ao salvar dados:', error);
            alert('Falha ao salvar as alterações!');
        });
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Exibir o nome da empresa selecionada */}
        <div className={styles.companySelected}>
        <span><strong>Empresa Selecionada:</strong> {currentCompany}</span>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.labelContainer}>
              <label>Departamento</label>
              <button type="button" className={styles.addButton} onClick={handleAddDepartment}>
                  + Criar Departamento
              </button>
          </div>
          
          <div className={styles.selectWrapper}>
              <select 
              name="department" 
              value={formData.department} 
              onChange={handleChange} 
              className={styles.selectDepartment}
              >
              <option value="">Selecione um departamento</option>
              {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
              ))}
              </select>
          </div>
        </div>

        <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
                <label>Seção</label>
                <button type="button" className={styles.addButtonSeção} onClick={handleAddSection}>
                    + Criar Seção
                </button>
            </div>
            
            <select 
                name="section" 
                value={formData.section} 
                onChange={handleChange}
                className={styles.selectsection}
            >
                <option value="">Selecione uma seção</option>
                {sections.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
                ))}
            </select>
        </div>

        <div className={styles.formGroup}>
        <label>ID</label>
        <input
            name="id"
            value={formData.id} 
            className={styles.selectid}
            placeholder="ID será gerado automaticamente"
            readOnly
        />
        </div>



        <div className={styles.formGroup}>
          <label>Título</label>
          <input name="title" value={formData.title} onChange={handleChange} className={styles.selecttitle} placeholder="Digite o título" />
        </div>

        <div className={styles.formGroup}>
          <label>URL - Acesso</label>
          <input name="urlAccess" value={formData.urlAccess} onChange={handleChange} className={styles.urlAccess} placeholder="Digite a URL de acesso" />
        </div>

        <div className={styles.formGroup}>
            <div className={styles.labelContainer}>
                <label>URL - Imagem</label>
                <a 
                href="https://www.canva.com/design/DAGf83bIYqs/jiHLBcZRLCMxh1KWmBwJXg/view?utm_content=DAGf83bIYqs&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.linkModelo}
                >
                Ver modelo
                </a>
            </div>
            <input 
                name="urlImage" 
                value={formData.urlImage} 
                onChange={handleChange} 
                className={styles.urlImage} 
                placeholder="Digite a URL da imagem" 
            />
            </div>


        {/* Checkbox para ativar o popup interativo */}
        <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          id="popupToggle"
          checked={showPopupEditor}
          onChange={(e) => setShowPopupEditor(e.target.checked)} // Correção do estado
        />
        <label htmlFor="popupToggle">Adicionar Popup Interativo</label>
      </div>


        {/* Editor de Texto (Aparece apenas se o checkbox estiver ativado) */}
        {showPopupEditor && (
        <div className={styles.editorContainer}>
        <ReactQuill
        theme="snow"
        value={formData.popupText}
        onChange={handlePopupChange}
        className={styles.quillEditor}
        />

        </div>
        )}


        <button type="submit" className={styles.submitButton}>Salvar</button>
      </form>
    </div>
  );
}

export default LinkForm;
