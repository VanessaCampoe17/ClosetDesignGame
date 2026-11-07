import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { restoreCanvas, serializeCanvas } from "../utils/canvasSerialization";

const LAYER_ORDER = {
  mannequin: 0,
  bottoms: 1,
  tops: 2,
  headwear: 3,
  accessories: 3,
  boundary: 4,
};

function sortCanvasLayers(canvas) {
  const sorted = [...canvas.getObjects()].sort((a, b) => {
    const layerA = LAYER_ORDER[a.layerType] ?? 2;
    const layerB = LAYER_ORDER[b.layerType] ?? 2;
    return layerA - layerB;
  });

  sorted.forEach((object, index) => {
    if (canvas.getObjects()[index] !== object) {
      canvas.moveObjectTo(object, index);
    }
  });
  canvas.requestRenderAll();
}

export default function DesignCanvas({
  selectedGarment,
  frame = "neutral",
  bodyType = "average",
  onRegisterCanvas,
  loadedCanvasData,
}) {
  const canvasElRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const garmentBoundaryRef = useRef(null);
  const fpsRef = useRef({ frames: 0, lastTime: 0 });

  const [fps, setFps] = useState(0);
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [strokeColor, setStrokeColor] = useState("#ff0000");
  const [opacity, setOpacity] = useState(1);
  const [isEraser, setIsEraser] = useState(false);

  const CANVAS_BG = "#f5f5f5";

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: 600,
      height: 800,
      backgroundColor: CANVAS_BG,
    });
    fabricCanvasRef.current = canvas;

    if (onRegisterCanvas) {
      onRegisterCanvas({
        getCanvasJSON: (garmentIds) => serializeCanvas(canvas, garmentIds),
      });
    }

    let animationFrameId;
    const measureFPS = (time) => {
      const tracker = fpsRef.current;
      if (tracker.lastTime === 0) tracker.lastTime = time;
      tracker.frames++;
      const elapsed = time - tracker.lastTime;
      if (elapsed >= 1000) {
        setFps(Math.round((tracker.frames * 1000) / elapsed));
        tracker.frames = 0;
        tracker.lastTime = time;
      }
      animationFrameId = requestAnimationFrame(measureFPS);
    };
    animationFrameId = requestAnimationFrame(measureFPS);

    const garmentBoundary = new fabric.Rect({
      left: 220,
      top: 270,
      width: 160,
      height: 140,
      fill: "transparent",
      stroke: "#888",
      strokeDashArray: [5, 5],
      data: { role: "garment-boundary" },
      selectable: false,
      evented: false,
    });
    garmentBoundary.layerType = "boundary";
    canvas.add(garmentBoundary);
    garmentBoundaryRef.current = garmentBoundary;

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.decimate = 2;
    canvas.isDrawingMode = true;

    const handlePathCreated = async (e) => {
      const path = e.path;
      const boundary = garmentBoundaryRef.current;
      if (!boundary) return;

      const clip = await boundary.clone();
      if (fabricCanvasRef.current !== canvas) return;
      clip.set({ absolutePositioned: true });
      path.clipPath = clip;
      path.layerType = "tops";
      sortCanvasLayers(canvas);
    };

    canvas.on("path:created", handlePathCreated);
    sortCanvasLayers(canvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.off("path:created", handlePathCreated);
      fabricCanvasRef.current = null;
      garmentBoundaryRef.current = null;
      canvas.dispose();
    };
  }, []);

  // Keep Fabric's logical 600x800 drawing area while scaling its display on narrow screens.
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;
    const resizeCanvas = () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      const width = Math.min(600, container.clientWidth);
      if (width <= 0) return;
      canvas.setDimensions({ width: `${width}px`, height: `${(width * 800) / 600}px` }, { cssOnly: true });
      canvas.calcOffset();
    };
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);
    resizeCanvas();
    return () => observer.disconnect();
  }, []);

  // Load the selected mannequin SVG
useEffect(() => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  let cancelled = false;
  let mannequinObject = null;

  const loadMannequin = async () => {
    try {
      const svgPath = `/assets/mannequins/${frame}_${bodyType}.svg`;

      const { objects, options } = await fabric.loadSVGFromURL(svgPath);

      if (cancelled) return;

      const validObjects = objects.filter(Boolean);
      if (!validObjects.length) return;

      mannequinObject = fabric.util.groupSVGElements(validObjects, options);

      mannequinObject.set({
        left: 200,
        top: 250,
        selectable: false,
        evented: false,
      });

      mannequinObject.scaleToWidth(200);
      mannequinObject.scaleToHeight(350);
      mannequinObject.layerType = "mannequin";

      canvas.add(mannequinObject);
      sortCanvasLayers(canvas);
    } catch (error) {
      console.error("Failed to load mannequin SVG:", error);
    }
  };

  loadMannequin();

  return () => {
    cancelled = true;
    if (mannequinObject) {
      canvas.remove(mannequinObject);
    }
  };
}, [frame, bodyType]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !selectedGarment) return;

    const category = selectedGarment.category;
    let garment;

    if (category === "tops") {
      garment = new fabric.Rect({
        left: 220,
        top: 270,
        width: 160,
        height: 140,
        fill: "rgba(0, 100, 255, 0.5)",
        selectable: false,
      });
    } else if (category === "bottoms") {
      garment = new fabric.Rect({
        left: 220,
        top: 410,
        width: 160,
        height: 190,
        fill: "rgba(0, 200, 100, 0.5)",
        selectable: false,
      });
    } else if (category === "headwear") {
      garment = new fabric.Rect({
        left: 250,
        top: 210,
        width: 100,
        height: 50,
        fill: "rgba(255, 180, 0, 0.7)",
        selectable: false,
      });
    }

    if (!garment) return;
    garment.layerType = category;
    canvas.add(garment);
    sortCanvasLayers(canvas);
  }, [selectedGarment]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !loadedCanvasData) return;

    let isCurrent = true;
    restoreCanvas(canvas, loadedCanvasData)
      .then(() => {
        if (!isCurrent) return;
        garmentBoundaryRef.current =
          canvas.getObjects().find((object) => object.data?.role === "garment-boundary") ||
          canvas.getObjects().find(
            (object) =>
              object.type === "rect" &&
              object.stroke === "#888" &&
              Array.isArray(object.strokeDashArray),
          ) ||
          null;
        // Layer metadata may not survive serialization; retain saved order
        // unless the serialization utility explicitly restores layerType.
        if (canvas.getObjects().every((object) => object.layerType)) {
          sortCanvasLayers(canvas);
        }
      })
      .catch((error) => {
        if (isCurrent) console.error("Failed to restore saved canvas:", error);
      });

    return () => {
      isCurrent = false;
    };
  }, [loadedCanvasData]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canvas.freeDrawingBrush) return;

    canvas.freeDrawingBrush.width = strokeWidth;
    if (isEraser) {
      canvas.freeDrawingBrush.color = CANVAS_BG;
    } else {
      const hex = strokeColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      canvas.freeDrawingBrush.color = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }, [strokeWidth, strokeColor, opacity, isEraser]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3 sm:gap-4">
        <label className="flex flex-wrap items-center gap-2 text-sm">
          Width: {strokeWidth}
          <input
            type="range"
            min="1"
            max="50"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
          />
        </label>
<label className="flex items-center gap-2 text-sm">
          Color:
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            disabled={isEraser}
          />
        </label>
<label className="flex flex-wrap items-center gap-2 text-sm">
          Opacity: {opacity.toFixed(2)}
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            disabled={isEraser}
          />
        </label>
        <button
          type="button"
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onClick={() => setIsEraser((prev) => !prev)}
        >
          {isEraser ? "Switch to Brush" : "Switch to Eraser"}
        </button>
      </div>

      <div className="mb-3 text-sm">
        <strong>FPS: {fps}</strong>
      </div>

      <div
        ref={canvasContainerRef}
        className="w-full max-w-[600px] overflow-hidden rounded-lg"
      >
        <canvas
          ref={canvasElRef}
          aria-label="Outfit design drawing canvas"
        />
      </div>
    </div>
  );
}
