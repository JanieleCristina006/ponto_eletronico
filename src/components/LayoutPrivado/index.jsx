import { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Outlet } from "react-router-dom";

export const LayoutPrivado = () => {
  const [larguraSidebar, setLarguraSidebar] = useState(200);
  const [sidebarCompacta, setSidebarCompacta] = useState(false);

  const larguraFinal = sidebarCompacta ? 80 : larguraSidebar;

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-gray-800 font-[Inter]">
      {/* Sidebar */}
      <Sidebar
        largura={larguraSidebar}
        setLargura={setLarguraSidebar}
        sidebarCompacta={sidebarCompacta}
        setSidebarCompacta={setSidebarCompacta}
      />

      {/* Main com margem lateral dinâmica */}
      <main
        style={{ marginLeft: `${larguraFinal}px` }}
        className="transition-all duration-300 p-6 md:p-10 space-y-10"
      >
        <Outlet />
      </main>
    </div>
  );
};
