import { useEffect, useRef } from "react";

export default function SavedOutfitsModal({
  isOpen,
  onClose,
  outfits,
  onLoadOutfit,
  onDeleteOutfit,
}) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const dialog = closeButtonRef.current?.closest('[role="dialog"]');
        const focusable = Array.from(dialog?.querySelectorAll('button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])') || []);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-[2px] sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="saved-looks-title"
        className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-4 sm:px-6">
          <h2 id="saved-looks-title" className="text-lg font-bold text-gray-900">Saved Looks</h2>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close saved looks" className="rounded-lg px-3 py-1 text-2xl leading-none text-gray-500 hover:bg-gray-100 hover:text-gray-900">&times;</button>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
          {outfits.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No saved outfits yet. Assemble an outfit on the canvas and click &quot;Save Current Look&quot;!</p>
          ) : (
            outfits.map((outfit) => (
              <div key={outfit.id} className="flex flex-col gap-3 rounded-xl border border-gray-200 p-3 hover:border-gray-400 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="break-words text-sm font-semibold text-gray-900">{outfit.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">{outfit.frame} • {outfit.bodyType} • {new Date(outfit.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => { onLoadOutfit(outfit); onClose(); }} className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-700">Load</button>
                  <button type="button" onClick={() => onDeleteOutfit(outfit.id)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end border-t border-gray-200 px-4 py-3 sm:px-6">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Close</button>
        </div>
      </div>
    </div>
  );
}
