import { useRef, useState, useEffect } from "react";
import logo from "./logo.svg"; // Substitua pelo caminho correto do seu logo

const itensMenu = ["Início", "Perfil", "Configurações", "Sair"]; // Exemplo

export default function Sidebar() {
  const [largura, setLargura] = useState(260); // Largura inicial
  const sidebarRef = useRef(null);

  // Função para redimensionar
  const redimensionar = (e) => {
    const novaLargura = e.clientX - sidebarRef.current.getBoundingClientRect().left;

    if (novaLargura < 60) setLargura(60);
    else if (novaLargura > 300) setLargura(300);
    else setLargura(novaLargura);
  };

  // Parar de redimensionar
  const pararRedimensionamento = () => {
    window.removeEventListener("mousemove", redimensionar);
    window.removeEventListener("mouseup", pararRedimensionamento);
  };

  // Iniciar redimensionamento
  const iniciarRedimensionamento = () => {
    window.addEventListener("mousemove", redimensionar);
    window.addEventListener("mouseup", pararRedimensionamento);
  };

  return (
    <aside
      ref={sidebarRef}
      style={{ width: `${largura}px` }}
      className="fixed top-0 bottom-0 left-0 bg-indigo-600 text-white overflow-hidden transition-all duration-300"
    >
      {/* Área de arrastar */}
      <div
        className="absolute top-0 bottom-0 right-0 w-2 cursor-col-resize hover:bg-white/10 z-50"
        onMouseDown={iniciarRedimensionamento}
      />

      <div className="h-full flex flex-col">
        {/* Cabeçalho */}
        <header className="flex items-center gap-4 px-4 h-16 bg-indigo-700">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-lg">PontoApp</span>
        </header>

        {/* Menu */}
        <nav className="flex-1 flex flex-col gap-2 p-4">
          {itensMenu.map((item) => (
            <button
              key={item}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors"
            >
              <span className="material-symbols-outlined">{item.toLowerCase()}</span>
              <p>{item}</p>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
