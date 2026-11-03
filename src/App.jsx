//Hello. Just practice for pushing stuff.

import { useState, useEffect, useRef } from "react";
import { getSavedOutfits, saveOutfit, deleteOutfit } from "./utils/outfitStorage";
import SavedOutfitsModal from "./components/SavedOutfitsModal";
import {
  Clock3,
  MapPin,
  Shirt,
  X,
  ChevronRight,
} from "lucide-react";

import DesignCanvas from "./components/DesignCanvas";
import clothingCatalog from "./data/clothingCatalog.json";
import { getCanvasGarmentIds } from "./utils/canvasSerialization";

function App() {
  const [eraOpen, setEraOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);

  const [selectedEra, setSelectedEra] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [selectedFrame, setSelectedFrame] = useState("neutral");
  const [selectedBodyType, setSelectedBodyType] = useState("average");

  // LocalStorage outfit persistence state
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [outfitNameInput, setOutfitNameInput] = useState("");
  const [loadedCanvasData, setLoadedCanvasData] = useState(null);

  // Ref to hold canvas serializer from DesignCanvas
  const canvasInterfaceRef = useRef(null);

  // Sync saved outfits from localStorage on initial render
  useEffect(() => {
    setSavedOutfits(getSavedOutfits());
  }, []);

  // Save current design configuration + Fabric drawing layers to localStorage
  const handleSaveCurrentOutfit = () => {
    const nameToSave = outfitNameInput.trim() || `Design #${savedOutfits.length + 1}`;
    const metadata = {
      frame: selectedFrame,
      bodyType: selectedBodyType,
    };

    // Serialize Fabric canvas drawings if available
    const garmentIds = selectedGarment ? [selectedGarment.id] : [];
    const canvasJSON =
      canvasInterfaceRef.current?.getCanvasJSON(garmentIds) || null;

    const canvasPayload = {
      drawingJSON: canvasJSON,
    };

    saveOutfit(nameToSave, canvasPayload, metadata);
    setSavedOutfits(getSavedOutfits());
    setOutfitNameInput("");
  };

  // Restore outfit configuration & drawn canvas strokes from localStorage
  const handleLoadOutfit = (outfit) => {
    if (outfit.frame) setSelectedFrame(outfit.frame);
    if (outfit.bodyType) setSelectedBodyType(outfit.bodyType);
    const canvasState = outfit.canvasState || {};
    const legacyGarment = canvasState.selectedGarment;
    const savedGarmentId =
      (canvasState.drawingJSON
        ? getCanvasGarmentIds(canvasState.drawingJSON)[0]
        : null) || legacyGarment?.id;
    setSelectedGarment(
      savedGarmentId
        ? clothingCatalog.items.find((item) => item.id === savedGarmentId) || null
        : null,
    );
    if (canvasState.drawingJSON) {
      setLoadedCanvasData(canvasState.drawingJSON);
    }
  };

  // Delete outfit from localStorage and update UI state
  const handleDeleteOutfit = (id) => {
    const remaining = deleteOutfit(id);
    setSavedOutfits(remaining);
  };

  // Build the era and region options directly from the catalog.
  const eras = [
    "All",
    ...new Set(clothingCatalog.items.map((item) => item.era)),
  ];

  const regions = [
    "All",
    ...new Set(clothingCatalog.items.map((item) => item.region)),
  ];

  const categories = ["all", "tops", "bottoms", "headwear"];

  // Filter garments using the user's current studio selections.
  const filteredGarments = clothingCatalog.items.filter((item) => {
    const eraMatches =
      selectedEra === "All" || item.era === selectedEra;

    const regionMatches =
      selectedRegion === "All" || item.region === selectedRegion;

    const categoryMatches =
      selectedCategory === "all" ||
      item.category === selectedCategory;

    return eraMatches && regionMatches && categoryMatches;
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Top navigation bar */}
      <nav className="flex h-16 items-center justify-between bg-white px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Shirt size={28} />
          <h1 className="text-xl font-bold">Closet Design Game</h1>
        </div>

        <div className="text-sm text-gray-500">
          Increment 1 Design Studio
        </div>
      </nav>

      <div className="flex">
        {/* Studio sidebar */}
        <aside className="min-h-[calc(100vh-4rem)] w-64 border-r bg-white p-4">
          <h2 className="mb-4 text-lg font-semibold">
            Clothing Studio
          </h2>

          {/* Era drawer */}
          <button
            onClick={() => setEraOpen((previous) => !previous)}
            className="mb-2 flex w-full items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
          >
            <span className="flex items-center gap-2">
              <Clock3 size={18} />
              Era
            </span>

            {eraOpen ? (
              <X size={17} />
            ) : (
              <ChevronRight size={17} />
            )}
          </button>

          {eraOpen && (
            <div className="mb-4 ml-3 space-y-1 border-l pl-3">
              {eras.map((era) => (
                <button
                  key={era}
                  onClick={() => setSelectedEra(era)}
                  className={`block w-full rounded p-2 text-left text-sm ${
                    selectedEra === era
                      ? "bg-gray-200 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {era}
                </button>
              ))}
            </div>
          )}

          {/* Region drawer */}
          <button
            onClick={() =>
              setRegionOpen((previous) => !previous)
            }
            className="mb-2 flex w-full items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
          >
            <span className="flex items-center gap-2">
              <MapPin size={18} />
              Region
            </span>

            {regionOpen ? (
              <X size={17} />
            ) : (
              <ChevronRight size={17} />
            )}
          </button>

          {regionOpen && (
            <div className="mb-4 ml-3 space-y-1 border-l pl-3">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`block w-full rounded p-2 text-left text-sm ${
                    selectedRegion === region
                      ? "bg-gray-200 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          )}

          {/* Clothing category buttons */}
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">
              Categories
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-lg border px-3 py-2 text-sm capitalize ${
                    selectedCategory === category
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {category === "headwear"
                    ? "Hats"
                    : category}
                </button>
              ))}
            </div>
          </div>

          {/* Mannequin customization controls */}
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold uppercase text-gray-500">
              Mannequin Settings
            </h3>
            <p className="mb-2 text-sm font-medium">Frame</p>
            <div className="grid grid-cols-3 gap-2">
              {["feminine", "masculine", "neutral"].map((frame) => (
                <button
                  key={frame}
                  type="button"
                  onClick={() => setSelectedFrame(frame)}
                  className={`rounded border p-2 text-xs capitalize ${
                    selectedFrame === frame
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {frame}
                </button>
              ))}
            </div>

            <p className="mb-2 mt-4 text-sm font-medium">Body Type</p>
            <div className="grid grid-cols-3 gap-2">
              {["slim", "average", "broad"].map((bodyType) => (
                <button
                  key={bodyType}
                  type="button"
                  onClick={() => setSelectedBodyType(bodyType)}
                  className={`rounded border p-2 text-xs capitalize ${
                    selectedBodyType === bodyType
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {bodyType}
                </button>
              ))}
            </div>
          </div>

          {/* Outfit LocalStorage Save / Load Controls */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">
              Saved Outfits
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Outfit name..."
                value={outfitNameInput}
                onChange={(e) => setOutfitNameInput(e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 focus:border-black focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveCurrentOutfit}
                className="w-full rounded bg-black py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
              >
                Save Current Look
              </button>
              <button
                type="button"
                onClick={() => setIsSavedModalOpen(true)}
                className="w-full rounded border border-gray-300 bg-white py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                View Saved Looks ({savedOutfits.length})
              </button>
            </div>
          </div>

          {/* Garments matching the selected filters */}
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">
              Garments
            </h3>

            {filteredGarments.length === 0 ? (
              <p className="text-sm text-gray-500">
                No garments match these filters.
              </p>
            ) : (
              <div className="space-y-2">
                {filteredGarments.map((garment) => (
                  <button
                    key={garment.id}
                    onClick={() => setSelectedGarment(garment)}
                    className={`w-full rounded-lg border p-3 text-left ${
                      selectedGarment?.id === garment.id
                        ? "border-black bg-gray-100"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-sm font-semibold">
                      {garment.name}
                    </div>

                    <div className="mt-1 text-xs text-gray-500">
                      {garment.era} • {garment.region}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main design area */}
        <main className="flex flex-1 flex-col items-center overflow-auto p-6">
          <div className="mb-4 w-full max-w-4xl">
            <h2 className="text-2xl font-bold">
              Design Studio
            </h2>

            <p className="text-sm text-gray-500">
              Choose a garment and customize it using the
              drawing tools.
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <DesignCanvas
              selectedGarment={selectedGarment}
              frame={selectedFrame}
              bodyType={selectedBodyType}
              onRegisterCanvas={(methods) => {
                canvasInterfaceRef.current = methods;
              }}
              loadedCanvasData={loadedCanvasData}
            />
          </div>
        </main>
      </div>

      {/* LocalStorage Saved Outfits Modal */}
      <SavedOutfitsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        outfits={savedOutfits}
        onLoadOutfit={handleLoadOutfit}
        onDeleteOutfit={handleDeleteOutfit}
      />
    </div>
  );
}

export default App;