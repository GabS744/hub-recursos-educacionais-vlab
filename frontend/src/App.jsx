import { useState, useEffect } from "react";
import api from "./services/api";
import "./App.css";
import CardFeatures from "./components/CardFeatures";
import NewResourceModal from "./components/NewResourceModal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const skip = currentPage * itemsPerPage;
      const response = await api.get(
        `/recursos/?skip=${skip}&limit=${itemsPerPage}`,
      );
      setResources(response.data);
    } catch (error) {
      toast.error("Erro ao carregar recursos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [currentPage]);

  const handleDelete = async (id) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este recurso?",
    );

    if (confirmed) {
      try {
        await api.delete(`/recursos/${id}`);
        toast.success("Recurso excluído com sucesso!");
        fetchResources();
      } catch (error) {
        toast.error("Falha ao excluir o recurso.");
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

      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-6xl mb-8 flex justify-between items-center">
        <h1 className="text-white text-3xl font-bold">
          Hub de Recursos Educacionais
        </h1>
        <button
          onClick={() => {
            setEditingResource(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + Novo Recurso
        </button>
      </div>

      {isLoading ? (
        <p className="text-white">Carregando recursos...</p>
      ) : (
        <>
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
                    onEdit={() => handleEdit(resource)}
                    onDelete={() => handleDelete(resource.id)}
                  />
                );
              })
            ) : (
              <p className="text-gray-400">Nenhum recurso encontrado.</p>
            )}
          </div>

          <div className="flex items-center gap-4 mt-12">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="p-2 rounded-full bg-slate-800 text-white disabled:opacity-30 hover:bg-slate-700 transition"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="text-white font-medium">
              Página {currentPage + 1}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={resources.length < itemsPerPage}
              className="p-2 rounded-full bg-slate-800 text-white disabled:opacity-30 hover:bg-slate-700 transition"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </>
      )}

      <NewResourceModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onResourceCreated={() => {
          fetchResources();
          toast.success(
            editingResource ? "Recurso atualizado!" : "Recurso criado!",
          );
        }}
        resourceToEdit={editingResource}
      />
    </div>
  );
}

export default App;
