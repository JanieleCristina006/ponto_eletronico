// React
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./FirebaseConection";

// Páginas e componentes
import { Home } from "./pages/Home";
import { Login } from "./components/Login";
import { RegistrarUsuario } from "./admin/RegistroDeUsuarios/RegistrarUsuario";
import ListaUsuarios from "./admin/components/pages/ListarUsuarios";
import { LayoutPrivado } from "./components/LayoutPrivado";
import { Relatorio } from "./pages/Relatorio";


export const RoutesApp = () => {
  const [usuario, setUsuario] = useState(null);
  const [cargo, setCargo] = useState(null); // "admin" ou "funcionario"
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

  if (carregando) return <div className="text-center p-10">Carregando...</div>;

  return (
    <BrowserRouter>
    <Routes>
      {/* Rota pública */}
      <Route path="/" element={<Login />} />
  
      {/* Rotas protegidas com LayoutPrivado */}
      {usuario && (
        <Route path="/" element={<LayoutPrivado />}>
          <Route path="home" element={<Home />} />
          <Route path="relatorio" element={<Relatorio />} /> {/* 👈 agora dentro do LayoutPrivado */}
  
          {cargo === "admin" && (
            <>
              <Route path="admin/registrar" element={<RegistrarUsuario />} />
              <Route path="admin/lista-usuarios" element={<ListaUsuarios />} />
            </>
          )}
  
          {/* Rota inválida → redireciona pro /home */}
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
