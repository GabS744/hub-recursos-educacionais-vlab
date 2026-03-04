import { useState, useEffect } from "react";
import api from "./services/api";
import "./App.css";

import CardFeatures from "./components/CardFeatures";
import NewResourceModal from "./components/NewResourceModal";

function App() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/recursos/");
      setResources(response.data);
    } catch (error) {
      console.error("Erro ao conectar com o backend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este recurso?",
    );
    if (confirmed) {
      try {
        await api.delete(`/recursos/${id}`);
        fetchResources();
      } catch (error) {
        console.error("Erro ao excluir recurso:", error);
        alert("Falha ao excluir o recurso.");
      }
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingResource(null);
  };

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
          {resources.length > 0 ? (
            resources.map((resource) => {
              const tagsList =
                typeof resource.tags === "string"
                  ? resource.tags.split(",").map((tag) => tag.trim())
                  : resource.tags;

              return (
                <CardFeatures
                  key={resource.id}
                  title={resource.titulo}
                  type={resource.tipo}
                  description={resource.descricao}
                  url={resource.url}
                  tags={tagsList}
                  onEdit={() => handleEdit({ ...resource, tags: tagsList })}
                  onDelete={() => handleDelete(resource.id)}
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
        onClose={closeModal}
        onResourceCreated={fetchResources}
        resourceToEdit={editingResource}
      />
    </div>
  );
}

export default App;
