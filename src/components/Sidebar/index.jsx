import { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiSettings,
} from "react-icons/fi";
import logo from "../../assets/logo.png";
import logoVisitante from "../../assets/clock_time_logo.png";
import { signOut } from "firebase/auth";
import { auth } from "../../FirebaseConection";
import { Tooltip } from "react-tooltip";

export const Sidebar = ({ sidebarCompacta, setSidebarCompacta, isVisitante }) => {
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  const itensMenu = isAdminRoute
    ? [
        { nome: "Dashboard", icone: <FiHome />, rota: "/admin" },
        { nome: "Usuários", icone: <FiUser />, rota: "/admin/usuarios" },
        { nome: "Relatórios", icone: <FiFileText />, rota: "/admin/relatorios" },
        { nome: "Configurações", icone: <FiSettings />, rota: "/admin/configuracoes" },
      ]
    : [
        { nome: "Início", icone: <FiHome />, rota: "/home" },
        !isVisitante && { nome: "Perfil", icone: <FiUser />, rota: "/perfil" },
        { nome: "Relatório", icone: <FiFileText />, rota: "/relatorio" },
      ].filter(Boolean);

  const alternarSidebar = () => setSidebarCompacta(!sidebarCompacta);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        style={{ width: `${sidebarCompacta ? 80 : 240}px` }}
        className="fixed top-0 left-0 bottom-0 bg-white dark:bg-gray-900 text-[#1E293B] dark:text-gray-100 shadow-lg z-50 transition-all duration-300 overflow-hidden border-r border-gray-200 dark:border-gray-700"
      >
        <div className="h-full flex flex-col">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <img
                src={isVisitante ? logoVisitante : logo}
                alt="Logo"
                className="w-8 h-8"
              />
              {!sidebarCompacta && (
                <h1 className="text-lg font-bold tracking-wide">
                  {isAdminRoute ? "Painel Admin" : "PontoWeb"}
                </h1>
              )}
            </div>
            <button
              onClick={alternarSidebar}
              className="cursor-pointer text-[#1E293B] dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
            >
              {sidebarCompacta ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          </div>

          {/* Navegação */}
          <nav className="flex-1 flex flex-col p-4 gap-2">
            {itensMenu.map((item, idx) => {
              const ativo = location.pathname === item.rota;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(item.rota)}
                  data-tooltip-id={`tooltip-${idx}`}
                  data-tooltip-content={item.nome}
                  data-tooltip-place="right"
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer
                    ${
                      ativo
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-600 dark:text-white"
                        : "hover:bg-[#E0E7FF] dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <span className="text-lg">{item.icone}</span>
                  {!sidebarCompacta && <span>{item.nome}</span>}
                </button>
              );
            })}
          </nav>

          {/* Botão de Sair */}
          <div className="px-4 pb-4 mt-auto">
            <button
              onClick={handleLogout}
              data-tooltip-id="tooltip-sair"
              data-tooltip-content="Sair"
              data-tooltip-place="right"
              className="flex items-center gap-3 w-full px-4 py-2 rounded-xl hover:bg-[#FEE2E2] dark:hover:bg-red-700 text-sm font-medium transition-colors cursor-pointer"
            >
              <span className="text-lg"><FiLogOut /></span>
              {!sidebarCompacta && <span>Sair</span>}
            </button>
          </div>

          {/* Rodapé */}
          {!sidebarCompacta && (
            <div className="text-xs text-center text-gray-400 dark:text-gray-500 pb-4">
              © 2025 Janiele Dev
            </div>
          )}
        </div>
      </aside>

      {/* Tooltips */}
      {sidebarCompacta && (
        <>
          {itensMenu.map((_, idx) => (
            <Tooltip
              key={idx}
              id={`tooltip-${idx}`}
              place="right"
              className="z-50 text-sm bg-indigo-600 text-white px-3 py-1 rounded shadow-md"
            />
          ))}
          <Tooltip
            id="tooltip-sair"
            place="right"
            className="z-50 text-sm bg-red-500 text-white px-3 py-1 rounded shadow-md"
          />
        </>
      )}
    </>
  );
};
