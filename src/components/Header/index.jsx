import React from 'react';

export const Header = ({ nome, isAdmin, onClickAdmin }) => {
  const saudacao =
    nome === 'Bem-vindo, visitante!' || nome === 'Visitante'
      ? 'Olá, visitante! 👋'
      : `Bem-vindo(a), ${nome}!`;

  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold text-gray-800">{saudacao}</h1>
      <p className="text-sm text-gray-500">Resumo do seu dia</p>

      {isAdmin && (
        <button
          onClick={onClickAdmin}
          className="mt-2 inline-block text-indigo-600 hover:underline text-sm"
        >
          Acessar área administrativa
        </button>
      )}
    </div>
  );
};
