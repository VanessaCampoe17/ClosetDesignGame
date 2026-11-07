const STORAGE_KEY = "closet_design_game_outfits";

/**
 * Retrieve all saved outfits from LocalStorage.
 * @returns {Array} Array of outfit objects
 */
export function getSavedOutfits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to load outfits from localStorage:", error);
    return [];
  }
}

/**
 * Save a new outfit.
 * @param {string} name - User-defined outfit name
 * @param {object} canvasState - Fabric.js canvas state or garment IDs
 * @param {object} metadata - Additional config (frame, bodyType)
 * @returns {object} The saved outfit object
 */
export function saveOutfit(name, canvasState, metadata = {}) {
  try {
    const existing = getSavedOutfits();
    const newOutfit = {
      id: `outfit_${Date.now()}`,
      name: name.trim() || `Look ${existing.length + 1}`,
      createdAt: new Date().toISOString(),
      frame: metadata.frame || "neutral",
      bodyType: metadata.bodyType || "average",
      canvasState: canvasState,
    };

    const updated = [newOutfit, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newOutfit;
  } catch (error) {
    console.error("Failed to save outfit to localStorage:", error);
    throw error;
  }
}

/**
 * Retrieve a single outfit by unique ID.
 * @param {string} id
 * @returns {object|null}
 */
export function getOutfitById(id) {
  const outfits = getSavedOutfits();
  return outfits.find((item) => item.id === id) || null;
}

/**
 * Delete an outfit from LocalStorage by ID.
 * @param {string} id
 * @returns {Array} Updated array of remaining outfits
 */
export function deleteOutfit(id) {
  try {
    const existing = getSavedOutfits();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error("Failed to delete outfit from localStorage:", error);
    throw error;
  }
}