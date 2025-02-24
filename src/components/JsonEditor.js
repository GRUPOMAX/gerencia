// src/components/JsonEditor.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function JsonEditor() {
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(false);

  // Carregar dados
  useEffect(() => {
    setLoading(true);
    axios.get('https://api.dashboard.admin.nexusnerds.com.br/api/max-links')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
        setLoading(false);
      });
  }, []);

  // Salvar os dados editados
  const saveData = () => {
    setLoading(true);
    axios.put('https://api.dashboard.admin.nexusnerds.com.br/api/max-links', data)
      .then(() => {
        alert('Dados salvos com sucesso!');
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao salvar dados:', error);
        setLoading(false);
      });
  };

  if (isLoading) return <p>Carregando...</p>;

  // Exemplo de interface simples de edição
  return (
    <div>
      <h1>Editor JSON</h1>
      <textarea
        rows="10"
        cols="50"
        value={JSON.stringify(data, null, 2)}
        onChange={e => setData(JSON.parse(e.target.value))}
      />
      <br />
      <button onClick={saveData}>Salvar</button>
    </div>
  );
}

export default JsonEditor;
