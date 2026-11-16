
import { useEffect, useState } from "react";
import { X, Download, Share2 } from "lucide-react";

const backgroundOptions = [
  { name: "White", color: "#ffffff" },
  { name: "Pink", color: "#ffe4e6" },
  { name: "Blue", color: "#dbeafe" },
  { name: "Cream", color: "#fff7ed" },
];

export default function ExportShareModal({
  isOpen,
  onClose,
  onGeneratePreview,
  onExport,
  onShare,
  isProcessing = false,
}) {
  const [designName, setDesignName] = useState("My Closet Design");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  // Update the preview whenever the background changes.
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    setIsPreviewLoading(true);
    setPreviewError("");
    setPreviewUrl("");

    Promise.resolve()
      .then(() => onGeneratePreview(backgroundColor))
      .then((image) => {
        if (!cancelled) setPreviewUrl(image);
      })
      .catch(() => {
        if (!cancelled) {
          setPreviewError("Unable to generate outfit preview.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsPreviewLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, backgroundColor, onGeneratePreview]);

  // Close the popup using the Escape key.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isProcessing) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const designOptions = {
    name: designName.trim() || "My Closet Design",
    backgroundColor,
  };

  const buttonsDisabled =
    isProcessing || isPreviewLoading || !previewUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="export-modal-title"
            className="text-xl font-bold"
          >
            Export / Share Outfit
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            aria-label="Close export popup"
          >
            <X size={22} />
          </button>
        </div>

        {/* Outfit preview */}
        <h3 className="mb-2 font-semibold">Outfit Preview</h3>

        <div className="mb-5 flex min-h-64 items-center justify-center rounded-lg border bg-gray-100 p-3">
          {isPreviewLoading ? (
            <p className="text-sm text-gray-500">
              Generating preview...
            </p>
          ) : previewError ? (
            <p role="alert" className="text-sm text-red-600">
              {previewError}
            </p>
          ) : (
            <img
              src={previewUrl}
              alt="Preview of your designed outfit"
              className="max-h-72 max-w-full object-contain"
            />
          )}
        </div>

        {/* Outfit name */}
        <label
          htmlFor="export-design-name"
          className="mb-2 block font-semibold"
        >
          Outfit Name
        </label>

        <input
          id="export-design-name"
          type="text"
          value={designName}
          onChange={(event) => setDesignName(event.target.value)}
          maxLength={80}
          className="mb-5 w-full rounded-lg border p-2"
          placeholder="Enter outfit name"
        />

        {/* Background selection */}
        <h3 className="mb-3 font-semibold">
          Background Color
        </h3>

        <div className="mb-6 grid grid-cols-4 gap-3">
          {backgroundOptions.map((option) => (
            <button
              key={option.name}
              type="button"
              onClick={() => setBackgroundColor(option.color)}
              aria-label={`${option.name} background`}
              aria-pressed={backgroundColor === option.color}
              className={`rounded-lg border-2 p-2 ${
                backgroundColor === option.color
                  ? "border-black"
                  : "border-gray-200"
              }`}
            >
              <div
                className="mx-auto h-9 w-9 rounded-full border"
                style={{ backgroundColor: option.color }}
              />
              <span className="mt-1 block text-xs">
                {option.name}
              </span>
            </button>
          ))}
        </div>

        {/* Export and share buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onExport(designOptions)}
            disabled={buttonsDisabled}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
          >
            <Download size={18} />
            Export PNG
          </button>

          <button
            type="button"
            onClick={() => onShare(designOptions)}
            disabled={buttonsDisabled}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
