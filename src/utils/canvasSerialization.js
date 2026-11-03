const SERIALIZED_CANVAS_VERSION = 1;

function parseCanvasPayload(serializedCanvas) {
  const payload =
    typeof serializedCanvas === "string"
      ? JSON.parse(serializedCanvas)
      : serializedCanvas;

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new TypeError("Canvas data must be a serialized canvas object.");
  }

  const isEnvelope = Object.hasOwn(payload, "canvas");
  const canvasData = isEnvelope ? payload.canvas : payload;

  if (
    !canvasData ||
    typeof canvasData !== "object" ||
    !Array.isArray(canvasData.objects)
  ) {
    throw new TypeError("Canvas data must contain an objects array.");
  }

  const garmentIds =
    isEnvelope && Array.isArray(payload.garmentIds)
      ? [...new Set(payload.garmentIds.filter((id) => typeof id === "string"))]
      : [];

  return { canvasData, garmentIds };
}

/**
 * Serialize a Fabric canvas and related garment IDs into a compact JSON string.
 * Fabric keeps canvas objects in stacking order, so the order in this payload
 * preserves the canvas layer order.
 */
export function serializeCanvas(canvas, garmentIds = []) {
  if (!Array.isArray(garmentIds)) {
    throw new TypeError("Garment IDs must be provided as an array.");
  }

  const payload = {
    version: SERIALIZED_CANVAS_VERSION,
    canvas: canvas.toObject(["data"]),
    garmentIds: [...new Set(garmentIds.filter((id) => typeof id === "string"))],
  };

  return JSON.stringify(payload);
}

export function getCanvasGarmentIds(serializedCanvas) {
  return parseCanvasPayload(serializedCanvas).garmentIds;
}

/**
 * Restore a serialized canvas into an existing Fabric canvas and return its
 * associated garment IDs. Legacy Fabric canvas JSON is also accepted.
 */
export async function restoreCanvas(canvas, serializedCanvas) {
  const { canvasData, garmentIds } = parseCanvasPayload(serializedCanvas);

  canvas.clear();
  await canvas.loadFromJSON(canvasData);
  canvas.requestRenderAll();

  return garmentIds;
}
