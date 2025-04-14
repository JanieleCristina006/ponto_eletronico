import { FaTachometerAlt, FaUsers, FaClock, FaChartBar, FaUserShield, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../FirebaseConection"; // ajuste o caminho conforme seu projeto

const menuItems = [
  { icon: <FaTachometerAlt />, label: "Painel", path: "/admin/dashboard" },
  { icon: <FaUsers />, label: "Funcionários", path: "/admin/funcionarios" },
  { icon: <FaClock />, label: "Registros de Ponto", path: "/admin/registros" },
  { icon: <FaChartBar />, label: "Relatórios", path: "/admin/relatorios" },
  { icon: <FaUserShield />, label: "Permissões", path: "/admin/permissoes" },
  { icon: <FaCog />, label: "Configurações", path: "/admin/configuracoes" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login"); // ou a rota que você quiser
  };

  return (
    <aside className="h-screen w-64 bg-[#35122E] text-white fixed left-0 top-0 shadow-lg flex flex-col justify-between">
      <div>
        <div className="text-center py-6 text-2xl font-bold border-b border-[#6B256F]">
          Ponto Admin
        </div>

        <nav className="mt-6 flex flex-col gap-2 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-[#6B256F] text-sm font-medium ${
                location.pathname === item.path ? "bg-[#6B256F]" : ""
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-[#6B256F]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#6B256F] hover:bg-[#581c5a] transition-all text-sm font-medium"
        >
          <FaSignOutAlt />
          Sair
        </button>
      </div>
    </aside>
  );
}
