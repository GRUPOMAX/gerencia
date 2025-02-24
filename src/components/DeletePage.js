import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './DeletePage.module.css';

function DeletePage({ currentCompany }) {
    const [departments, setDepartments] = useState([]);
    const [sections, setSections] = useState([]);

    useEffect(() => {
        axios.get(`https://api.dashboard.admin.nexusnerds.com.br/api/${currentCompany}-links`)
            .then(response => {
                setDepartments(Object.keys(response.data.accessPermissions));
                setSections(response.data.sections.map(sec => sec.title));
            })
            .catch(error => console.error("Erro ao carregar os dados:", error));
    }, [currentCompany]);

    const handleDeleteDepartment = (department) => {
        if (!window.confirm(`Tem certeza que deseja excluir o departamento "${department}"? Esta ação não pode ser desfeita.`)) return;

        axios.delete(`https://api.dashboard.admin.nexusnerds.com.br/api/${currentCompany}/delete-department`, {
            data: { department }  
        })
            .then(response => {
                alert(response.data.message);
                setDepartments(prev => prev.filter(dept => dept !== department));
            })
            .catch(error => console.error("Erro ao excluir departamento:", error));
    };

    const handleDeleteSection = (sectionTitle) => {
        if (!window.confirm(`Tem certeza que deseja excluir a seção "${sectionTitle}"? Esta ação não pode ser desfeita.`)) return;

        axios.delete(`https://api.dashboard.admin.nexusnerds.com.br/api/${currentCompany}/delete-section`, {
            data: { sectionTitle }  
        })
            .then(response => {
                alert(response.data.message);
                setSections(prev => prev.filter(sec => sec !== sectionTitle));
            })
            .catch(error => console.error("Erro ao excluir seção:", error));
    };

    return (
        <div className={styles.wrapper}>
            <h2>Excluir Departamentos e Seções</h2>
            
            <div className={styles.container}>
                {/* Departamentos */}
                <div className={styles.column}>
                    <h3>Departamentos</h3>
                    {departments.length === 0 ? (
                        <p>Nenhum departamento encontrado.</p>
                    ) : (
                        <ul className={styles.list}>
                            {departments.map(dept => (
                                <li key={dept} className={styles.item}>
                                    <span>{dept}</span>
                                    <button className={styles.deleteButton} onClick={() => handleDeleteDepartment(dept)}>Remover</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Seções */}
                <div className={styles.column}>
                    <h3>Seções</h3>
                    {sections.length === 0 ? (
                        <p>Nenhuma seção encontrada.</p>
                    ) : (
                        <ul className={styles.list}>
                            {sections.map(sec => (
                                <li key={sec} className={styles.item}>
                                    <span>{sec}</span>
                                    <button className={styles.deleteButton} onClick={() => handleDeleteSection(sec)}>Remover</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DeletePage;
