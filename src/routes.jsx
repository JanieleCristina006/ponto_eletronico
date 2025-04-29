// React
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GridLoader } from "react-spinners";

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./FirebaseConection";

// Páginas e componentes
import { Home } from "./pages/Home";
import { Login } from "./components/Login";
import { LayoutPrivado } from "./components/LayoutPrivado";
import { Relatorio } from "./pages/Relatorio";
import { Perfil } from "./pages/Perfil";
import { PainelAdmin } from "./pages/admin/PainelAdmin";
import { RelatoriosAdmin } from "./pages/admin/RelatoriosAdmin";
import { UsuariosAdmin } from "./pages/admin/UsuariosAdmin";
import { NovoUsuario } from "./pages/admin/NovoUsuario"; // 👈 importa



export const RoutesApp = () => {
  const [usuario, setUsuario] = useState(null);
  const [cargo, setCargo] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuario(user);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCargo(docSnap.data().role);
        }
      } else {
        setUsuario(null);
        setCargo(null);
      }
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  if (carregando) return (
    <div className="flex w-full h-screen items-center justify-center">
      <GridLoader size={20} color="#4338CA" />
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/" element={<Login />} />
  
        {/* Rotas protegidas com LayoutPrivado */}
        {usuario && (
          <Route path="/" element={<LayoutPrivado cargo={cargo} />}>
            <Route path="home" element={<Home />} />
            <Route path="relatorio" element={<Relatorio />} />
            <Route path="perfil" element={<Perfil />} />
  
            {/* 🔥 Nova rota protegida para ADMIN */}
            {cargo === "admin" && (
              <>
                <Route path="admin" element={<PainelAdmin />} />
                <Route path="/admin/usuarios" element={<UsuariosAdmin />} /> 
                <Route path="/admin/usuarios/novo" element={<NovoUsuario />} />
                <Route path="/admin/relatorios" element={<RelatoriosAdmin />} />
              </>
            )}
  
            {/* Rota inválida → redireciona para /home */}
            <Route path="*" element={<Navigate to="/home" />} />
          </Route>
        )}
  
        {/* Se não estiver logado, qualquer rota redireciona pro login */}
        {!usuario && (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};
