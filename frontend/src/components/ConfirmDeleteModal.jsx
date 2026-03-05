import { AlertTriangle, Loader2 } from "lucide-react";

function ConfirmDeleteModal({ isOpen, onClose, onConfirm, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 text-center space-y-4 transform transition-all">
        <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} className="text-red-500" />
        </div>

        <h2 className="text-xl font-bold text-gray-800">Excluir Recurso?</h2>

        <p className="text-gray-500 text-sm">
          Tem certeza que deseja excluir este material? Esta ação não poderá ser
          desfeita.
        </p>

        <div className="flex gap-3 pt-4 mt-2">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 font-medium rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isDeleting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Sim, Excluir"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
