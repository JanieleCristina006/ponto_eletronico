import { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // IMPORTANTE: useLocation adicionado
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
import { signOut } from "firebase/auth";
import { auth } from "../../FirebaseConection";

export const Sidebar = ({ largura, setLargura, sidebarCompacta, setSidebarCompacta }) => {
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // 📍 Pega a rota atual

  const isAdminRoute = location.pathname.startsWith("/admin"); // Verifica se está no /admin

  // Define os itens do menu dinamicamente baseado na rota
  const itensMenu = isAdminRoute
    ? [
        { nome: "Dashboard", icone: <FiHome />, rota: "/admin" },
        { nome: "Usuários", icone: <FiUser />, rota: "/admin/usuarios" },
        { nome: "Relatórios", icone: <FiFileText />, rota: "/admin/relatorios" },
        { nome: "Configurações", icone: <FiSettings />, rota: "/admin/configuracoes" },
      ]
    : [
        { nome: "Início", icone: <FiHome />, rota: "/home" },
        { nome: "Perfil", icone: <FiUser />, rota: "/perfil" },
        { nome: "Relatório", icone: <FiFileText />, rota: "/relatorio" },
      ];

  const redimensionar = (e) => {
    const novaLargura = e.clientX - sidebarRef.current.getBoundingClientRect().left;
    if (novaLargura < 100) setLargura(150);
    else if (novaLargura > 320) setLargura(320);
    else setLargura(novaLargura);
  };

  const iniciarRedimensionamento = () => {
    window.addEventListener("mousemove", redimensionar);
    window.addEventListener("mouseup", pararRedimensionamento);
  };

  const pararRedimensionamento = () => {
    window.removeEventListener("mousemove", redimensionar);
    window.removeEventListener("mouseup", pararRedimensionamento);
  };

  const alternarSidebar = () => {
    setSidebarCompacta(!sidebarCompacta);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); 
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  return (
    <aside
      ref={sidebarRef}
      style={{ width: `${sidebarCompacta ? 80 : largura}px` }}
      className="fixed top-0 left-0 bottom-0 bg-white text-[#1E293B] shadow-lg z-50 transition-all duration-300 overflow-hidden"
    >
      <div className="h-full flex flex-col">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            {!sidebarCompacta && (
              <h1 className="text-lg font-bold tracking-wide">
                {isAdminRoute ? "Painel Admin" : "PontoApp"}
              </h1>
            )}
          </div>
          <button
            onClick={alternarSidebar}
            className="text-[#1E293B] hover:text-gray-500 transition-colors"
          >
            {sidebarCompacta ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        {/* Menu principal */}
        <nav className="flex-1 flex flex-col p-4 gap-2">
          {itensMenu.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.rota)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-[#CBD5E1] transition-colors text-sm font-medium"
            >
              <span className="text-lg">{item.icone}</span>
              {!sidebarCompacta && <span>{item.nome}</span>}
            </button>
          ))}
        </nav>

        {/* Botão "Sair" fixado no final */}
        <div className="px-4 pb-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-xl hover:bg-[#CBD5E1] transition-colors text-sm font-medium"
          >
            <span className="text-lg"><FiLogOut /></span>
            {!sidebarCompacta && <span>Sair</span>}
          </button>
        </div>

        {!sidebarCompacta && (
          <div className="text-xs text-center text-gray-400 pb-4">
            © 2025 Janiele Dev
          </div>
        )}
      </div>

      {!sidebarCompacta && (
        <div
          onMouseDown={iniciarRedimensionamento}
          className="absolute top-0 bottom-0 right-0 w-2 cursor-col-resize hover:bg-gray-300 transition-colors"
        />
      )}
    </aside>
  );
};
