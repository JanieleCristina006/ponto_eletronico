import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Páginas e componentes
import { Home } from "./pages/Home";
import { Login } from "./components/Login";
import { RegistrarUsuario } from "./admin/RegistroDeUsuarios/RegistrarUsuario";
import ListaUsuarios from "./admin/components/pages/ListarUsuarios";

// Firebase
import { auth, db } from "./FirebaseConection";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const RoutesApp = () => {
  const [usuario, setUsuario] = useState(null);
  const [cargo, setCargo] = useState(null); // "admin" ou "funcionario"
  const [carregando, setCarregando] = useState(true);

  // Verifica se o usuário está logado e busca o cargo dele no Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuario(user);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCargo(docSnap.data().role); // role = "admin" ou "funcionario"
        }
      } else {
        setUsuario(null);
        setCargo(null);
      }
      setCarregando(false);
    });

    return () => unsubscribe(); // limpa o listener
  }, []);

  // Enquanto verifica, mostra carregando
  if (carregando) return <div className="text-center p-10">Carregando...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública (login) */}
        <Route path="/" element={<Login />} />
        <Route path="/admin/lista-usuarios" element={<ListaUsuarios />} />

        {/* Rotas protegidas - acessadas só se o usuário estiver logado */}
        {usuario ? (
          <>
            {/* Página inicial */}
            <Route path="/home" element={<Home />} />

            {/* Rota de administrador: cadastro de usuários */}
            {cargo === "admin" && (
              <Route path="/admin/registrar" element={<RegistrarUsuario />} />
            )}

            {/* Qualquer rota inválida redireciona para /home */}
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        ) : (
          // Se o usuário não estiver logado, redireciona tudo para login
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};
