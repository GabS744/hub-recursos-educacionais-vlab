import { useState, useEffect } from "react";
import api from "./services/api";
import "./App.css";

import CardFeatures from "./components/CardFeatures";
import NewResourceModal from "./components/NewResourceModal";

function App() {
  const [recursos, setRecursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buscarRecursos = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/recursos/");
      setRecursos(response.data);
    } catch (error) {
      console.error("Erro ao conectar com o backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    buscarRecursos();
  }, []);

  return (
    <div className="bg-[#12192B] min-h-screen w-full p-10 flex flex-col items-center">
      <div className="w-full max-w-6xl mb-8 flex justify-between items-center">
        <h1 className="text-white text-3xl font-bold">
          Hub de Recursos Educacionais
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + Novo Recurso
        </button>
      </div>

      {isLoading ? (
        <p className="text-white">Carregando recursos...</p>
      ) : (
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recursos.length > 0 ? (
            recursos.map((recurso) => {
              const listaDeTags =
                typeof recurso.tags === "string"
                  ? recurso.tags.split(",").map((tag) => tag.trim())
                  : recurso.tags;

              return (
                <CardFeatures
                  key={recurso.id}
                  titulo={recurso.titulo}
                  tipo={recurso.tipo}
                  descricao={recurso.descricao}
                  url={recurso.url}
                  tags={listaDeTags}
                />
              );
            })
          ) : (
            <p className="text-gray-400">Nenhum recurso cadastrado ainda.</p>
          )}
        </div>
      )}

      <NewResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRecursoCriado={buscarRecursos}
      />
    </div>
  );
}

export default App;
