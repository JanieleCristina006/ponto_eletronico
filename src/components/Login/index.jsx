import { useState } from "react";
import logo from '../../assets/ilustracao.svg'; 
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { auth } from "../../FirebaseConection";
import { signInWithEmailAndPassword, sendPasswordResetEmail, signInAnonymously } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiLogIn, FiUser } from 'react-icons/fi';
import ClipLoader from "react-spinners/ClipLoader";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailInvalido, setEmailInvalido] = useState(false);

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.(com|br|net|org|edu|gov|info|dev)$/i.test(email);

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
        setTimeout(() => navigate('/home'), 1500);
      })
      .catch(() => toast.warn("Email ou senha incorretos!"))
      .finally(() => setLoading(false));
  }

  const handleEsqueceuSenha = async () => {
    if (!validarEmail(email)) {
      toast.warn("Digite um e-mail válido para recuperar a senha.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Se esse e-mail estiver cadastrado, você receberá uma mensagem de recuperação.");
    } catch (error) {
      toast.error("Erro ao enviar o e-mail. Verifique se o e-mail está correto.");
    }
  };

  function entrarComoVisitante() {
    signInAnonymously(auth)
      .then(() => {
        toast.success("Entrando como visitante...");
        setTimeout(() => navigate("/home"), 1000);
      })
      .catch((error) => {
        console.error("Erro ao entrar como visitante:", error);
        toast.error("Erro ao entrar como visitante.");
      });
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          padding: "16px 20px",
          fontSize: "0.95rem",
          lineHeight: "1.5",
          borderRadius: "10px",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
          maxWidth: "360px"
        }}
      />

      <div className="min-h-screen bg-gradient-to-tr from-[#1f2937] to-[#0f172a] flex items-center justify-center px-4">

        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden">

          {/* Lado da ilustração */}
          <div className="hidden md:flex w-1/2 bg-[#f3f4f6] items-center justify-center p-8">
            <img src={logo} alt="Logo ilustrativa" className="w-[60%] max-w-[280px]" />
          </div>

          {/* Lado do formulário */}
          <div className="w-full md:w-1/2 p-10">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Acesse sua conta</h2>
              <p className="text-sm text-gray-500 mt-1">Faça login com suas credenciais</p>
            </div>

            <form className="space-y-6" onSubmit={logarUser}>
              {/* Input de e-mail */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="E-mail"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => {
                    const valor = e.target.value;
                    setEmail(valor);
                    setEmailInvalido(!validarEmail(valor));
                  }}
                  className={`w-full border rounded-xl px-4 py-3 pr-10 placeholder-gray-600 focus:outline-none transition-all focus:ring-2 ${
                    email === ''
                      ? 'border-gray-300 focus:ring-black'
                      : emailInvalido
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-green-500 focus:ring-green-500'
                  }`}
                  required
                />
                {email && (
                  <span className="absolute right-3 top-[13px] flex items-center justify-center">
                    {emailInvalido ? (
                      <FiXCircle className="text-red-500 h-5 w-5" />
                    ) : (
                      <FiCheckCircle className="text-green-500 h-5 w-5" />
                    )}
                  </span>
                )}
              </div>

              {/* Input de senha */}
              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full border rounded-xl px-4 py-3 pr-12 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
                <button
                  type="button"
                  onClick={() => senha && setMostrarSenha(!mostrarSenha)}
                  className={`absolute inset-y-0 right-3 flex items-center transition-opacity ${
                    senha ? 'text-gray-500 cursor-pointer opacity-100' : 'text-gray-300 cursor-not-allowed opacity-50'
                  }`}
                >
                  {mostrarSenha ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>

              {/* Link de recuperação de senha */}
              <div className="flex justify-end text-sm">
                <button
                  type="button"
                  onClick={handleEsqueceuSenha}
                  className="text-black hover:underline focus:outline-none cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              </div>

              {/* Botão de login */}
              <button
                type="submit"
                className="w-full bg-[#4f46e5] hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                disabled={loading || !email || !senha || emailInvalido}
              >
                {loading ? <ClipLoader size={20} color="#ffffff" /> : (<><FiLogIn /> Entrar</>)}
              </button>

              {/* Botão de visitante */}
              <button
                type="button"
                onClick={entrarComoVisitante}
                className="w-full cursor-pointer border border-black text-black font-semibold py-3 rounded-xl transition-all duration-300 hover:bg-black hover:text-white"
              >
                Entrar como Visitante
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};