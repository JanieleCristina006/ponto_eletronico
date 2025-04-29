export const Header = ({ nome, isAdmin, onClickAdmin }) => {
    return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-semibold">Bem-vinda, {nome}!</h2>
          <p className="text-sm text-gray-500">Resumo do seu dia</p>
        </div>
        {isAdmin && (
          <button
            onClick={onClickAdmin}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-6 py-2 rounded-lg shadow cursor-pointer"
          >
            Acessar Painel Administrativo
          </button>
        )}
      </div>
    );
  } 
  