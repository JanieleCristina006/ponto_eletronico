export const Header = ({ nome, isAdmin, onClickAdmin }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold">Bem-vinda, {nome}!</h2>
        <p className="text-sm text-gray-500">Resumo do seu dia</p>
      </div>

      {isAdmin && (
        <button
          onClick={onClickAdmin}
          className="w-full sm:w-auto max-w-xs sm:max-w-none bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium py-2 px-4 rounded-lg shadow transition mx-auto sm:mx-0"
        >
          Acessar Painel Administrativo
        </button>
      )}
    </div>
  );
};
