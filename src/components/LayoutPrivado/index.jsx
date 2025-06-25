import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../FirebaseConection";

export const LayoutPrivado = ({ cargo }) => {
  const [larguraSidebar, setLarguraSidebar] = useState(200);
  const [sidebarCompacta, setSidebarCompacta] = useState(false);
  const [isVisitante, setIsVisitante] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      if (usuario && usuario.isAnonymous) {
        setIsVisitante(true);
      } else {
        setIsVisitante(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const larguraFinal = sidebarCompacta ? 80 : larguraSidebar;

  return (
    <div className="min-h-screen text-gray-800 font-[Inter]">
      
      <Sidebar
        largura={larguraSidebar}
        setLargura={setLarguraSidebar}
        sidebarCompacta={sidebarCompacta}
        setSidebarCompacta={setSidebarCompacta}
        isVisitante={isVisitante}
      />

      <main
        style={{ marginLeft: `${larguraFinal}px` }}
        className="transition-all duration-300 px-8 space-y-10"
      >
        <Outlet />
      </main>
    </div>
  );
};
