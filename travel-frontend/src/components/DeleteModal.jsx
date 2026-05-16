import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white text-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="bg-red-100 text-red-600 p-3 rounded-full">
            <AlertTriangle size={28} />
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800"
          >
            <X size={22} />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-2">Delete Trip?</h2>

        <p className="text-slate-600 mb-6">
          Are you sure you want to delete this saved trip? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}