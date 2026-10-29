import { describe, it, expect, beforeEach } from "vitest";
import {
  saveOutfit,
  getSavedOutfits,
  deleteOutfit,
  getOutfitById,
} from "../outfitStorage";
import {
  serializeCanvas,
  restoreCanvas,
  getCanvasGarmentIds,
} from "../canvasSerialization";

describe("Pair 3: LocalStorage & Serialization Integration Suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("completes full outfit lifecycle: save, retrieve, extract garments, and delete", () => {
    const testName = "Victorian Gala Test";
    const testMetadata = { frame: "feminine", bodyType: "slim" };

    const mockCanvas = {
      toObject: () => ({
        version: "5.3.0",
        objects: [{ type: "path", stroke: "#ff0000" }],
      }),
    };

    const garmentList = ["1890s-eu-victorian-corset-01"];
    const serializedString = serializeCanvas(mockCanvas, garmentList);

    // 1. Save Outfit
    const saved = saveOutfit(testName, { drawingJSON: serializedString }, testMetadata);
    expect(saved).toBeDefined();
    expect(saved.id).toBeDefined();
    expect(saved.name).toBe(testName);
    expect(saved.frame).toBe("feminine");
    expect(saved.bodyType).toBe("slim");

    // 2. Fetch and Verify from LocalStorage
    const storedList = getSavedOutfits();
    expect(storedList).toHaveLength(1);
    expect(storedList[0].id).toBe(saved.id);

    // 3. Extract Garment IDs from Serialized Payload
    const extractedIds = getCanvasGarmentIds(storedList[0].canvasState.drawingJSON);
    expect(extractedIds).toEqual(["1890s-eu-victorian-corset-01"]);

    // 4. Test getOutfitById if available
    if (typeof getOutfitById === "function") {
      const fetched = getOutfitById(saved.id);
      expect(fetched).toBeDefined();
      expect(fetched.id).toBe(saved.id);
    }

    // 5. Delete Outfit and Confirm LocalStorage is Clean
    const remaining = deleteOutfit(saved.id);
    expect(remaining).toHaveLength(0);
    expect(getSavedOutfits()).toHaveLength(0);
  });

  it("recovers gracefully from corrupted JSON in localStorage without throwing exceptions", () => {
    localStorage.setItem("closet_saved_outfits", "{bad-json-syntax:::[");

    const result = getSavedOutfits();
    expect(result).toEqual([]);
  });

  it("correctly injects garmentIds and preserves custom canvas properties during serialization", () => {
    const mockFabricCanvas = {
      toObject: () => ({
        version: "5.3.0",
        objects: [
          {
            type: "rect",
            data: { role: "garment-boundary" },
            selectable: false,
            evented: false,
          },
          {
            type: "path",
            stroke: "rgba(255,0,0,1)",
          },
        ],
      }),
    };

    const garmentIds = ["1950s-na-greaser-jacket-01"];
    const jsonOutput = serializeCanvas(mockFabricCanvas, garmentIds);

    expect(typeof jsonOutput).toBe("string");

    const parsed = JSON.parse(jsonOutput);
    expect(parsed.garmentIds).toEqual(["1950s-na-greaser-jacket-01"]);
    expect(parsed.canvas.objects).toHaveLength(2);
    expect(parsed.canvas.objects[0].data.role).toBe("garment-boundary");
  });

  it("preserves multiple saved outfit records independently", async () => {
    saveOutfit("Look 1", { drawingJSON: "{}" }, { frame: "neutral", bodyType: "average" });

    // Delay guarantees separate millisecond IDs
    await new Promise((resolve) => setTimeout(resolve, 10));

    saveOutfit("Look 2", { drawingJSON: "{}" }, { frame: "masculine", bodyType: "broad" });

    const outfits = getSavedOutfits();
    expect(outfits).toHaveLength(2);

    const firstOutfitId = outfits[0].id;
    const afterDelete = deleteOutfit(firstOutfitId);

    expect(afterDelete).toHaveLength(1);
    expect(afterDelete[0].id).toBe(outfits[1].id);
  });

  it("handles valid JSON payloads with empty or missing garments cleanly", () => {
    // Valid JSON with objects array and empty garmentIds
    const emptyPayload = JSON.stringify({
      version: "1.0.0",
      canvas: { objects: [] },
      garmentIds: [],
    });
    expect(getCanvasGarmentIds(emptyPayload)).toEqual([]);

    // Valid JSON with objects array but missing garmentIds property
    const missingGarments = JSON.stringify({
      version: "1.0.0",
      canvas: { objects: [] },
    });
    expect(getCanvasGarmentIds(missingGarments)).toEqual([]);

    // Direct object structure with objects array
    expect(
      getCanvasGarmentIds({
        canvas: { objects: [] },
        garmentIds: ["test-id"],
      })
    ).toEqual(["test-id"]);
  });

  it("handles edge cases and validates error throwing for invalid canvas payloads", async () => {
    // 1. Delete non-existent ID
    const listBefore = getSavedOutfits();
    const afterMissingDelete = deleteOutfit("non-existent-id-999");
    expect(afterMissingDelete.length).toBe(listBefore.length);

    // 2. Verify invalid canvas payload throws TypeError (matches parseCanvasPayload line 21)
    expect(() => getCanvasGarmentIds(JSON.stringify({ canvas: {} }))).toThrow(
      TypeError
    );

    // 3. restoreCanvas with mock canvas providing clear, loadFromJSON, and requestRenderAll
    if (typeof restoreCanvas === "function") {
      const mockCanvasInstance = {
        clear: () => {},
        loadFromJSON: (data, callback) => {
          if (typeof callback === "function") callback();
          return Promise.resolve();
        },
        requestRenderAll: () => {},
        renderAll: () => {},
      };

      const validPayload = JSON.stringify({
        version: "1.0.0",
        canvas: { objects: [] },
        garmentIds: [],
      });

      await expect(
        restoreCanvas(mockCanvasInstance, validPayload)
      ).resolves.not.toThrow();
    }
  });
});