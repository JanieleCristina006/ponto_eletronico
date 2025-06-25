import React, { useEffect, useState } from 'react';
import { FiSettings, FiMoon, FiSun } from 'react-icons/fi';

export const Header = ({ nome, isAdmin, onClickAdmin }) => {
  const [temaEscuro, setTemaEscuro] = useState(false);

  // Aplica tema ao carregar a página
  useEffect(() => {
    const temDark = document.documentElement.classList.contains('dark');
    setTemaEscuro(temDark);
  }, []);

  // Alternar tema
  const toggleTema = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setTemaEscuro(false);
    } else {
      html.classList.add('dark');
      setTemaEscuro(true);
    }
  };

  const saudacao =
    nome === 'Bem-vindo, visitante!' || nome === 'Visitante'
      ? 'Olá, visitante! 👋'
      : `Bem-vindo(a), ${nome}!`;

  return (
    <div className="mb-4 flex items-start justify-between flex-wrap gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{saudacao}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-300">Resumo do seu dia</p>
      </div>

      <div className="flex items-center gap-2">
        {/* <button
          onClick={toggleTema}
          className="flex items-center gap-2 px-4 py-2 rounded-lg shadow text-sm transition bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
          title="Alternar modo escuro"
        >
          {temaEscuro ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
          {temaEscuro ? 'Modo Claro' : 'Modo Escuro'}
        </button> */}

       
        {isAdmin && (
          <button
            onClick={onClickAdmin}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition-colors text-sm font-medium"
          >
            <FiSettings className="text-lg" />
            Painel Admin
          </button>
        )}
      </div>
    </div>
  );
};
