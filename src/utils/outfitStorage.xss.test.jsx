import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { saveOutfit, getSavedOutfits } from "./outfitStorage";
import { restoreCanvas } from "./canvasSerialization";
import SavedOutfitsModal from "../components/SavedOutfitsModal";

describe("localStorage & SavedOutfitsModal XSS Security Audit", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores and HTML-escapes script-injection outfit names when rendered", () => {
    const xssPayload = `<script>alert("xss")</script><img src=x onerror="alert(1)">`;

    const saved = saveOutfit(
      xssPayload,
      { equippedIds: ["1890s_eu_top"] },
      { frame: "neutral", bodyType: "average" }
    );

    const loadedOutfits = getSavedOutfits();
    expect(loadedOutfits).toHaveLength(1);
    expect(loadedOutfits[0].name).toBe(xssPayload);
    expect(saved.id).toBeDefined();

    const renderedHtml = renderToStaticMarkup(
      <SavedOutfitsModal
        isOpen={true}
        onClose={() => {}}
        outfits={loadedOutfits}
        onLoadOutfit={() => {}}
        onDeleteOutfit={() => {}}
      />
    );

    // Raw unescaped HTML tags must NOT exist in the rendered markup
    expect(renderedHtml).not.toContain("<script>");
    expect(renderedHtml).not.toContain("<img ");
    // React escapes the angle brackets into harmless HTML entities
    expect(renderedHtml).toContain("&lt;script&gt;");
  });

  it("safely handles tampered or non-array JSON in localStorage without crashing", () => {
    localStorage.setItem(
      "closet_design_game_outfits",
      JSON.stringify({ malicious: "object_instead_of_array" })
    );
    expect(getSavedOutfits()).toEqual([]);

    localStorage.setItem("closet_design_game_outfits", "{corrupted_json");
    expect(getSavedOutfits()).toEqual([]);
  });

  it("strips unsafe external or javascript: image objects during canvas restoration", async () => {
    const mockCanvas = {
      clear: vi.fn(),
      loadFromJSON: vi.fn().mockResolvedValue(undefined),
      requestRenderAll: vi.fn(),
    };

    const maliciousPayload = JSON.stringify({
      version: 1,
      garmentIds: ["1890s_eu_top"],
      canvas: {
        objects: [
          { type: "path", path: [["M", 0, 0]] },
          { type: "image", src: "javascript:alert(1)" },
          { type: "image", src: "https://evil.example.com/tracker.png" },
          {
            type: "image",
            src: "/assets/garments/1890s/victorian_corset_bodice.svg",
          },
        ],
      },
    });

    const ids = await restoreCanvas(mockCanvas, maliciousPayload);
    expect(ids).toEqual(["1890s_eu_top"]);

    const passedCanvasData = mockCanvas.loadFromJSON.mock.calls[0][0];
    expect(passedCanvasData.objects).toHaveLength(2);
    expect(passedCanvasData.objects[0].type).toBe("path");
    expect(passedCanvasData.objects[1].src).toBe(
      "/assets/garments/1890s/victorian_corset_bodice.svg"
    );
  });
});