import { useEffect, useRef, useState } from "react";
import {
  FiMail, FiCalendar, FiEdit2, FiCamera,
  FiDollarSign, FiGift, FiCreditCard, FiUser,
  FiPhone, FiMapPin, FiBriefcase, FiClock, FiFileText, FiInfo
} from "react-icons/fi";
import { auth, db } from "../../FirebaseConection";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const Perfil = ({ modoVisitante = false }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [dataCadastro, setDataCadastro] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [carregandoFoto, setCarregandoFoto] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const inputFotoRef = useRef();

  useEffect(() => {
    async function carregarDados() {
      const usuario = auth.currentUser;
      if (!usuario) return;

      const docRef = doc(db, "users", usuario.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const dados = docSnap.data();
        setNome(dados.nome || "Sem nome");
        setEmail(dados.email || "Sem email");
        setFotoUrl(dados.fotoUrl || "");
        setNovoNome(dados.nome || "");
        setNovoEmail(dados.email || "");

        if (dados.criadoEm?.seconds) {
          const dataFormatada = new Date(dados.criadoEm.seconds * 1000).toLocaleDateString();
          setDataCadastro(dataFormatada);
        } else {
          setDataCadastro("Desconhecida");
        }
      }
    }

    carregarDados();
  }, []);

  const handleSelecionarImagem = () => {
    if (!modoVisitante) inputFotoRef.current.click();
  };

  const handleUploadImagem = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCarregandoFoto(true);

    try {
      const usuario = auth.currentUser;
      const storage = getStorage();
      const caminho = `fotosPerfil/${usuario.uid}`;
      const storageRef = ref(storage, caminho);

      await uploadBytes(storageRef, file);
      const urlDownload = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "users", usuario.uid), {
        fotoUrl: urlDownload,
      });

      setFotoUrl(`${urlDownload}?t=${new Date().getTime()}`);
      alert("✅ Foto atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
    } finally {
      setCarregandoFoto(false);
    }
  };

  const handleSalvarEdicao = async () => {
    try {
      const usuario = auth.currentUser;
      await updateDoc(doc(db, "users", usuario.uid), {
        nome: novoNome,
        email: novoEmail,
      });
      setNome(novoNome);
      setEmail(novoEmail);
      setShowModal(false);
      alert("✅ Dados atualizados com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar os dados.");
    }
  };

  return (
    <section className="flex justify-center p-6 md:p-10 bg-[#F8FAFC] min-h-screen">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-4xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div
            className={`relative w-28 h-28 rounded-full bg-purple-100 flex items-center justify-center text-4xl text-purple-700 font-bold shadow-md ${modoVisitante ? 'cursor-default' : 'cursor-pointer'} overflow-hidden`}
            onClick={handleSelecionarImagem}
          >
            {carregandoFoto ? (
              <span className="text-sm text-purple-700 animate-pulse">Carregando...</span>
            ) : fotoUrl ? (
              <img src={fotoUrl} alt="Foto de perfil" className="w-full h-full object-cover rounded-full" />
            ) : (
              nome[0]
            )}
            {!modoVisitante && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <FiCamera className="text-white text-xl" />
              </div>
            )}
          </div>

          {!modoVisitante && (
            <input type="file" accept="image/*" onChange={handleUploadImagem} ref={inputFotoRef} hidden />
          )}

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">{nome}</h2>
          <p className="text-sm text-gray-500">Funcionário(a) desde {dataCadastro}</p>

          {!modoVisitante && (
            <button
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#6B256F] hover:bg-[#571c59] text-white text-sm font-medium rounded-xl transition"
              onClick={() => setShowModal(true)}
            >
              <FiEdit2 className="text-sm" />
              Editar Nome e Email
            </button>
          )}
        </div>

        {modoVisitante ? (
          <div className="flex flex-col items-center text-center mt-4 text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-xl p-6">
            <FiInfo className="text-3xl mb-2" />
            <p className="text-sm font-medium">
              Você está no modo visitante.<br />
              As informações desse perfil são apenas para visualização.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
            <div className="flex items-center gap-2 bg-gray-100 p-4 rounded-xl shadow-inner">
              <FiMail className="text-gray-500" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 p-4 rounded-xl shadow-inner">
              <FiCalendar className="text-gray-500" />
              <span>Cadastro: {dataCadastro}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 p-4 rounded-xl shadow-inner">
              <FiUser className="text-gray-500" />
              <span>Data de Nascimento: 15/08/1998</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 p-4 rounded-xl shadow-inner">
              <FiPhone className="text-gray-500" />
              <span>Telefone: (11) 91234-5678</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 p-4 rounded-xl shadow-inner">
              <FiMapPin className="text-gray-500" />
              <span>Endereço: Rua Exemplo, 123 - SP</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 p-4 rounded-xl shadow-inner">
              <FiBriefcase className="text-gray-500" />
              <span>Cargo: Desenvolvedora Front-End</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 p-4 rounded-xl shadow-inner">
              <FiClock className="text-gray-500" />
              <span>Jornada: 08h às 17h</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 p-4 rounded-xl shadow-inner">
              <FiFileText className="text-gray-500" />
              <span>Tipo de Contrato: CLT</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 p-4 rounded-xl shadow-inner">
              <FiDollarSign className="text-gray-500" />
              <span>Salário: R$ 3.500,00</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 p-4 rounded-xl shadow-inner">
              <FiCreditCard className="text-gray-500" />
              <span>Vale Alimentação: R$ 600,00</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 p-4 rounded-xl shadow-inner">
              <FiGift className="text-gray-500" />
              <span>Bonificação: Sim</span>
            </div>
          </div>
        )}

        {!modoVisitante && showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-[#35122E]">Editar Informações</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Novo nome"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
                />
                <input
                  type="email"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  placeholder="Novo email"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSalvarEdicao}
                    className="px-4 py-2 rounded bg-[#6B256F] text-white text-sm hover:bg-[#571c59]"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
