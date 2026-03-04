import { useState, useEffect } from "react";
import { X, Sparkles, Loader2 } from "lucide-react";
import api from "../services/api";

function NewResourceModal({
  isOpen,
  onClose,
  onResourceCreated,
  resourceToEdit,
}) {
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "Vídeo",
    url: "",
    descricao: "",
    tags: "",
  });

  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (resourceToEdit && isOpen) {
      setFormData({
        ...resourceToEdit,
        tags: Array.isArray(resourceToEdit.tags)
          ? resourceToEdit.tags.join(", ")
          : resourceToEdit.tags,
      });
    } else if (isOpen) {
      setFormData({
        titulo: "",
        tipo: "Vídeo",
        url: "",
        descricao: "",
        tags: "",
      });
    }
  }, [resourceToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSmartAssist = async () => {
    if (!formData.titulo) {
      alert("Por favor, preencha o Título primeiro para a IA ter contexto.");
      return;
    }

    setIsAIGenerating(true);

    try {
      const response = await api.post("/recursos/smart-assist", {
        titulo: formData.titulo,
        tipo: formData.tipo,
      });

      setFormData((prev) => ({
        ...prev,
        descricao: response.data.descricao,
        tags: response.data.tags.join(", "),
      }));
    } catch (error) {
      console.error("Erro na geração por IA:", error);
      alert("A IA falhou ou demorou muito para responder. Tente novamente.");
    } finally {
      setIsAIGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const dataToSend = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      };

      if (resourceToEdit) {
        await api.put(`/recursos/${resourceToEdit.id}`, dataToSend);
      } else {
        await api.post("/recursos/", dataToSend);
      }

      onResourceCreated();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar recurso:", error);
      alert("Ocorreu um erro ao tentar salvar. Verifique o console.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {resourceToEdit ? "Editar Recurso" : "Novo Recurso Educacional"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                required
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Curso de Python para Iniciantes"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Tipo</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Vídeo">Vídeo</option>
                <option value="PDF">PDF</option>
                <option value="Link">Link</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              URL do Material
            </label>
            <input
              required
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={handleSmartAssist}
              disabled={isAIGenerating}
              className="flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 px-4 py-2 rounded-lg font-medium text-sm transition disabled:opacity-50"
            >
              {isAIGenerating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              {isAIGenerating
                ? "Processando com IA..."
                : "Gerar Descrição com IA ✨"}
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              required
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrição gerada ou digitada..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Tags (separadas por vírgula)
            </label>
            <input
              required
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Programação, IA, Iniciante"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              {resourceToEdit ? "Atualizar Recurso" : "Salvar Recurso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewResourceModal;
