import { FiClock, FiGithub, FiLinkedin } from "react-icons/fi";

export const Footer = () => {
  return (
    <footer className="w-full  dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 mt-10">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-2 text-sm">
          <FiClock className="text-indigo-600 dark:text-indigo-400" />
          <span className="font-medium">Sistema de Ponto Eletrônico © {new Date().getFullYear()}</span>
        </div>

        
        <div className="flex items-center gap-4 text-sm">
          <a
            href="https://github.com/JanieleCristina006"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <FiGithub size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/janiele-cristina/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <FiLinkedin size={18} />
          </a>
          <span className="hidden sm:inline">Desenvolvido por Janiele Cristina</span>
        </div>
      </div>
    </footer>
  );
};
