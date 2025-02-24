import React, { useState } from 'react';
import styles from './CompanySelector.module.css';

function CompanySelector({ setCurrentCompany }) {
  const [selectedCompany, setSelectedCompany] = useState('Max'); // Estado para empresa selecionada

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setCurrentCompany(company);
  };

  return (
    <div className={styles.companySelector}>
      <button 
        className={styles.companyButton} 
        onClick={() => handleCompanyClick('Max')}
      >
        <div className={`${styles.ellipse}`} 
          style={{ borderColor: selectedCompany === 'Max' ? '#17A717' : '#000' }} 
        ></div>
        Max Fibra
      </button>
      <button 
        className={styles.companyButton} 
        onClick={() => handleCompanyClick('Vir')}
      >
        <div className={`${styles.ellipse}`} 
          style={{ borderColor: selectedCompany === 'Vir' ? '#17A717' : '#000' }} 
        ></div>
        Vir Telecom
      </button>
      <button 
        className={styles.companyButton} 
        onClick={() => handleCompanyClick('Reis')}
      >
        <div className={`${styles.ellipse}`} 
          style={{ borderColor: selectedCompany === 'Reis' ? '#17A717' : '#000' }} 
        ></div>
        Reis Service
      </button>
    </div>
  );
}

export default CompanySelector;
