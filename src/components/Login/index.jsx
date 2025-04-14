import { useState } from "react";
import logo from '../../assets/logo.png';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { auth } from "../../FirebaseConection";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailInvalido, setEmailInvalido] = useState(false);

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  async function logarUser(event) {
    event.preventDefault();

    if (!validarEmail(email)) {
      setEmailInvalido(true);
      toast.warn("Digite um e-mail válido!");
      return;
    }

    setLoading(true);

    await signInWithEmailAndPassword(auth, email, senha)
      .then(() => {
        toast.success("Usuário logado com sucesso!");
        setEmail('');
        setSenha('');
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      })
      .catch((error) => {
        toast.warn("Email ou senha incorretos!");
        console.log("Erro!" + error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-[#35122E] px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg shadow-[#6B256F]/30 p-8 space-y-6">

          {/* Logo */}
          <div className="flex flex-col items-center">
            <img src={logo} alt="Logo" className="w-32 h-32 mb-2" />
          </div>

          <h2 className="text-2xl font-semibold text-center text-[#35122E]">Entrar no sistema</h2>
          <p className="text-sm text-gray-500 text-center -mt-4">Use seu e-mail cadastrado</p>

          <form className="space-y-5" onSubmit={logarUser}>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailInvalido(!validarEmail(e.target.value));
                }}
                className={`w-full border rounded-lg px-4 py-3 placeholder-gray-600 focus:outline-none focus:ring-2 ${
                  emailInvalido ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#6B256F]'
                }`}
                required
              />
              {emailInvalido && (
                <p className="text-red-500 text-sm mt-1">Digite um e-mail válido.</p>
              )}
            </div>

            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-[#6B256F] placeholder-gray-600"
                required
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {mostrarSenha ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="text-right text-sm">
              <a href="#" className="text-[#6B256F] hover:underline">Esqueceu a senha?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#6B256F] hover:bg-[#582158] text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="flex gap-1 text-xl font-bold tracking-widest">
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse delay-100">.</span>
                  <span className="animate-pulse delay-200">.</span>
                </span>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
