const SERIALIZED_CANVAS_VERSION = 1;

const ALLOWED_FABRIC_TYPES = new Set([
  "path",
  "group",
  "rect",
  "circle",
  "polygon",
  "polyline",
  "line",
  "image",
]);

function isSafeImageSrc(src) {
  if (typeof src !== "string") return false;
  return src.startsWith("/assets/") || src.startsWith("data:image/");
}

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

  const sanitizedObjects = canvasData.objects.filter((obj) => {
    if (!obj || typeof obj !== "object" || typeof obj.type !== "string") {
      return false;
    }
    const normalizedType = obj.type.toLowerCase();
    if (!ALLOWED_FABRIC_TYPES.has(normalizedType)) {
      return false;
    }
    if (normalizedType === "image" && !isSafeImageSrc(obj.src)) {
      return false;
    }
    return true;
  });

  const garmentIds =
    isEnvelope && Array.isArray(payload.garmentIds)
      ? [...new Set(payload.garmentIds.filter((id) => typeof id === "string"))]
      : [];

  return {
    canvasData: { ...canvasData, objects: sanitizedObjects },
    garmentIds,
  };
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