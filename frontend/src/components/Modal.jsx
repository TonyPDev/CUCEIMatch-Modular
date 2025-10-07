import { X } from "lucide-react";

const Modal = ({ onClose, title, children }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-brand-purple to-pink-500">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-brand-purple to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
