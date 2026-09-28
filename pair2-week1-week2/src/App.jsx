import {
  Brush,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  FolderOpen,
  GalleryHorizontalEnd,
  Globe2,
  History,
  Layers3,
  Menu,
  Palette,
  Redo2,
  Save,
  Scissors,
  Shirt,
  Sparkles,
  Undo2,
  UserRound,
  X
} from "lucide-react";
import React from "react";
import { useMemo, useState } from "react";

const eras = [
  { id: "1970s", label: "70s", note: "flared silhouettes, saturated prints" },
  { id: "1980s", label: "80s", note: "bold shoulders, athletic layers" },
  { id: "1990s", label: "90s", note: "denim, relaxed streetwear shapes" },
  { id: "1920s", label: "20s", note: "drop waists, evening textures" }
];

const regions = [
  { id: "western-europe", label: "Western Europe" },
  { id: "east-asia", label: "East Asia" },
  { id: "west-africa", label: "West Africa" },
  { id: "north-america", label: "North America" }
];

const categories = [
  { id: "tops", label: "Tops", icon: Shirt },
  { id: "bottoms", label: "Bottoms", icon: Layers3 },
  { id: "hats", label: "Hats", icon: Sparkles }
];

const toolButtons = [
  { label: "Brush", icon: Brush },
  { label: "Palette", icon: Palette },
  { label: "Cut", icon: Scissors },
  { label: "Layers", icon: Layers3 },
  { label: "Undo", icon: Undo2 },
  { label: "Redo", icon: Redo2 }
];

function IconButton({ icon: Icon, label, active = false, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid h-10 w-10 place-items-center rounded-md border transition ${
        active
          ? "border-clay bg-clay text-white"
          : "border-stone-300 bg-white text-ink hover:border-denim hover:text-denim"
      }`}
    >
      <Icon size={19} strokeWidth={2.1} />
    </button>
  );
}

function Drawer({ side, title, icon: Icon, open, onToggle, children }) {
  const isLeft = side === "left";

  return (
    <>
      <button
        type="button"
        aria-label={open ? `Close ${title}` : `Open ${title}`}
        title={title}
        onClick={onToggle}
        className={`fixed top-24 z-30 grid h-12 w-9 place-items-center rounded-md border border-stone-300 bg-white text-ink shadow-drawer transition hover:text-clay ${
          isLeft ? "left-3" : "right-3"
        }`}
      >
        {open ? (
          isLeft ? (
            <ChevronLeft size={19} />
          ) : (
            <ChevronRight size={19} />
          )
        ) : (
          <Icon size={19} />
        )}
      </button>

      <aside
        className={`fixed top-[73px] z-20 h-[calc(100vh-73px)] w-[min(88vw,340px)] border-stone-300 bg-linen shadow-drawer transition-transform duration-300 ${
          isLeft ? "left-0 border-r" : "right-0 border-l"
        } ${open ? "translate-x-0" : isLeft ? "-translate-x-full" : "translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-stone-300 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-white text-clay">
                <Icon size={19} />
              </span>
              <h2 className="text-base font-semibold text-ink">{title}</h2>
            </div>
            <IconButton icon={X} label={`Close ${title}`} onClick={onToggle} />
          </div>
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
        </div>
      </aside>
    </>
  );
}

function SelectionCard({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-md border px-4 py-3 text-left transition ${
        selected
          ? "border-clay bg-white shadow-sm"
          : "border-stone-300 bg-transparent hover:border-denim hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}

export default function App() {
  const defaultDrawerOpen = () =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : true;
  const [leftOpen, setLeftOpen] = useState(defaultDrawerOpen);
  const [rightOpen, setRightOpen] = useState(defaultDrawerOpen);
  const [selectedEra, setSelectedEra] = useState("1970s");
  const [selectedRegion, setSelectedRegion] = useState("western-europe");
  const [selectedCategory, setSelectedCategory] = useState("tops");

  const studioStatus = useMemo(() => {
    const era = eras.find((item) => item.id === selectedEra)?.label;
    const region = regions.find((item) => item.id === selectedRegion)?.label;
    const category = categories.find((item) => item.id === selectedCategory)?.label;
    return `${era} / ${region} / ${category}`;
  }, [selectedEra, selectedRegion, selectedCategory]);

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-ink">
      <header className="sticky top-0 z-40 border-b border-stone-300 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-ink text-white">
              <Shirt size={22} />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-normal">Closet Design Game</h1>
              <p className="truncate text-sm text-stone-600">Studio UI prototype</p>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {toolButtons.map((tool) => (
              <IconButton key={tool.label} icon={tool.icon} label={tool.label} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <IconButton icon={History} label="History" />
            <IconButton icon={Save} label="Save outfit" />
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-denim px-4 text-sm font-semibold text-white transition hover:bg-[#244b65]"
            >
              <FolderOpen size={17} />
              Gallery
            </button>
            <button
              type="button"
              aria-label="Menu"
              title="Menu"
              className="grid h-10 w-10 place-items-center rounded-md border border-stone-300 bg-white text-ink md:hidden"
            >
              <Menu size={19} />
            </button>
          </div>
        </nav>
      </header>

      <Drawer
        side="left"
        title="Era and Region"
        icon={Globe2}
        open={leftOpen}
        onToggle={() => setLeftOpen((value) => !value)}
      >
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-normal text-stone-600">Era</h3>
          <div className="grid gap-3">
            {eras.map((era) => (
              <SelectionCard
                key={era.id}
                selected={selectedEra === era.id}
                onClick={() => setSelectedEra(era.id)}
              >
                <span className="block text-sm font-semibold text-ink">{era.label}</span>
                <span className="mt-1 block text-sm text-stone-600">{era.note}</span>
              </SelectionCard>
            ))}
          </div>
        </section>

        <section className="mt-7 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-normal text-stone-600">Region</h3>
          <div className="grid gap-2">
            {regions.map((region) => (
              <SelectionCard
                key={region.id}
                selected={selectedRegion === region.id}
                onClick={() => setSelectedRegion(region.id)}
              >
                <span className="text-sm font-semibold text-ink">{region.label}</span>
              </SelectionCard>
            ))}
          </div>
        </section>
      </Drawer>

      <Drawer
        side="right"
        title="Garment Categories"
        icon={GalleryHorizontalEnd}
        open={rightOpen}
        onToggle={() => setRightOpen((value) => !value)}
      >
        <div className="grid gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-3 rounded-md border px-4 py-4 text-left transition ${
                  selectedCategory === category.id
                    ? "border-clay bg-white shadow-sm"
                    : "border-stone-300 hover:border-denim hover:bg-white"
                }`}
              >
                <span
                  className={`grid h-10 w-10 place-items-center rounded-md ${
                    selectedCategory === category.id ? "bg-clay text-white" : "bg-white text-denim"
                  }`}
                >
                  <Icon size={20} />
                </span>
                <span className="font-semibold">{category.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-7 rounded-md border border-stone-300 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CircleHelp size={17} className="text-clay" />
            Placeholder state
          </div>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Category buttons are wired to React state and ready to connect to Fabric.js item spawning in
            Week 3.
          </p>
        </div>
      </Drawer>

      <section className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl place-items-center px-4 py-8 sm:px-6">
        <div className="grid w-full gap-5 lg:grid-cols-[1fr_280px]">
          <div className="rounded-md border border-stone-300 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-normal text-stone-600">
                  Current filters
                </p>
                <p className="text-base font-semibold text-ink">{studioStatus}</p>
              </div>
              <div className="flex items-center gap-2 md:hidden">
                {toolButtons.slice(0, 4).map((tool) => (
                  <IconButton key={tool.label} icon={tool.icon} label={tool.label} />
                ))}
              </div>
            </div>

            <div className="grid aspect-[4/3] min-h-[360px] place-items-center rounded-md border border-dashed border-stone-400 bg-[#f4efe7]">
              <div className="text-center">
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-md border border-stone-300 bg-white text-moss">
                  <UserRound size={54} strokeWidth={1.6} />
                </div>
                <p className="mt-4 max-w-full text-lg font-semibold text-ink">Canvas handoff area</p>
                <p className="mx-auto mt-2 max-w-full px-4 text-sm leading-6 text-stone-600 sm:max-w-sm">
                  Pair 1's Fabric.js canvas can mount here while the Studio UI keeps filters and category
                  choices in React state.
                </p>
              </div>
            </div>
          </div>

          <aside className="rounded-md border border-stone-300 bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold">Studio State</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <dt className="text-stone-600">Era</dt>
                <dd className="font-semibold">{selectedEra}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-3">
                <dt className="text-stone-600">Region</dt>
                <dd className="text-right font-semibold">
                  {regions.find((item) => item.id === selectedRegion)?.label}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-stone-600">Category</dt>
                <dd className="font-semibold">{selectedCategory}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </main>
  );
}
