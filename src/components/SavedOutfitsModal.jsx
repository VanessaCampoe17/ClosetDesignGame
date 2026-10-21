import React from "react";

export default function SavedOutfitsModal({
  isOpen,
  onClose,
  outfits,
  onLoadOutfit,
  onDeleteOutfit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b">
          <h2 className="text-lg font-bold text-gray-900">Saved Looks</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto flex-1 my-4 space-y-3">
          {outfits.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-8">
              No saved outfits yet. Assemble an outfit on the canvas and click "Save Look"!
            </p>
          ) : (
            outfits.map((outfit) => (
              <div
                key={outfit.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:border-gray-400 transition"
              >
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">{outfit.name}</h4>
                  <p className="text-xs text-gray-500">
                    {outfit.frame} • {outfit.bodyType} •{" "}
                    {new Date(outfit.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      onLoadOutfit(outfit);
                      onClose();
                    }}
                    className="px-3 py-1 bg-black text-white text-xs rounded hover:bg-gray-800"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => onDeleteOutfit(outfit.id)}
                    className="px-2 py-1 text-red-600 hover:text-red-800 text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}