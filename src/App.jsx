import { useState } from "react";
import {
  Clock3,
  MapPin,
  Shirt,
  X,
  ChevronRight,
} from "lucide-react";

import DesignCanvas from "./components/DesignCanvas";
import clothingCatalog from "./data/clothingCatalog.json";

function App() {
  const [eraOpen, setEraOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);

  const [selectedEra, setSelectedEra] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGarment, setSelectedGarment] = useState(null);

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
            <DesignCanvas selectedGarment={selectedGarment} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;