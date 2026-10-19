import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";



const FRAME_WIDTHS = {
  feminine: 180,
  masculine: 215,
  neutral: 200,
};

const BODY_MULTIPLIERS = {
  slim: 0.85,
  average: 1,
  broad: 1.15,
};

const GARMENT_COLORS = {
  tops: "rgba(0, 100, 255, 0.5)",
  bottoms: "rgba(0, 180, 100, 0.5)",
  headwear: "rgba(255, 180, 0, 0.7)",
};

function getMannequinWidth(frame, bodyType) {
  return (
    (FRAME_WIDTHS[frame] ?? 200) *
    (BODY_MULTIPLIERS[bodyType] ?? 1)
  );
}

function getGarmentBounds(category, mannequinWidth) {
  const scale = mannequinWidth / 200;

  if (category === "tops") {
    return {
      left: 300 - 80 * scale,
      top: 270,
      width: 160 * scale,
      height: 140,
    };
  }

  if (category === "bottoms") {
    return {
      left: 300 - 80 * scale,
      top: 410,
      width: 160 * scale,
      height: 190,
    };
  }

  if (category === "headwear") {
    return {
      left: 300 - 50 * scale,
      top: 210,
      width: 100 * scale,
      height: 50,
    };
  }

  return null;
}

const LAYER_ORDER = {
  mannequin: 0,
  bottoms: 1,
  tops: 2,
  headwear: 3,
  boundary: 4,
};

function sortCanvasLayers(canvas) {
  const objects = [...canvas.getObjects()];

  objects.sort(
    (a, b) =>
      (LAYER_ORDER[a.layerType] ?? 2) -
      (LAYER_ORDER[b.layerType] ?? 2)
  );

  objects.forEach((object, index) => {
    canvas.moveObjectTo(object, index);
  });

  canvas.requestRenderAll();
}


export default function DesignCanvas({
  selectedGarment,
  frame,
  bodyType,
}) {
  const canvasElRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const garmentBoundaryRef = useRef(null); // holds the current clip shape
  const mannequinRef = useRef(null);
  const equippedGarmentsRef = useRef({});

  // Tracks the frames for our FPS counter
const fpsRef = useRef({
  frames: 0,
  lastTime: 0,
});

const [fps, setFps] = useState(0);

  const [strokeWidth, setStrokeWidth] = useState(5);
  const [strokeColor, setStrokeColor] = useState("#ff0000");
  const [opacity, setOpacity] = useState(1);
  const [isEraser, setIsEraser] = useState(false);

  const CANVAS_BG = "#f5f5f5";

  // Initialize canvas once
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: 600,
      height: 800,
      backgroundColor: CANVAS_BG,
      
    });
    fabricCanvasRef.current = canvas;

    
// Measures the browser's animation frame rate
let animationFrameId;

const measureFPS = (time) => {
  const tracker = fpsRef.current;

  if (tracker.lastTime === 0) {
    tracker.lastTime = time;
  }

  tracker.frames++;

  const elapsed = time - tracker.lastTime;

  // Update the FPS every second
  if (elapsed >= 1000) {
    setFps(Math.round((tracker.frames * 1000) / elapsed));

    tracker.frames = 0;
    tracker.lastTime = time;
  }

  animationFrameId = requestAnimationFrame(measureFPS);
};

animationFrameId = requestAnimationFrame(measureFPS);


    const mannequin = new fabric.Rect({
      left: 200,
      top: 250,
      width: 200,
      height: 350,
      fill: "#dcdcdc",
      selectable: false,
    });
    canvas.add(mannequin);
    mannequin.layerType = "mannequin";
    mannequinRef.current = mannequin;

    // Placeholder "garment boundary" — stand-in for a real SVG template
    // from Pair 3. Visible as a dashed outline; not selectable/drawable on.
    const garmentBoundary = new fabric.Rect({
      left: 220,
      top: 270,
      width: 160,
      height: 140,
      fill: "transparent",
      stroke: "#888",
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
    });
    canvas.add(garmentBoundary);
    garmentBoundaryRef.current = garmentBoundary;
    garmentBoundary.layerType = "boundary";

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

    canvas.freeDrawingBrush.decimate = 2;
    canvas.isDrawingMode = true;
   

    // Clip every new freehand stroke to the garment boundary shape
    const handlePathCreated = async (e) => {
      const path = e.path;
      const boundary = garmentBoundaryRef.current;
      if (!boundary) return;

      const clip = await boundary.clone();
      clip.set({
        absolutePositioned: true, // use canvas coords, not the path's local coords
      });
      path.clipPath = clip;
      canvas.requestRenderAll();
    };

    canvas.on("path:created", handlePathCreated);

  return () => {
  cancelAnimationFrame(animationFrameId);
  canvas.off("path:created", handlePathCreated);
  canvas.dispose();
};
  }, []);
  useEffect(() => {
    const canvas = fabricCanvasRef.current;

    if (!canvas || !selectedGarment) return;

    const category = selectedGarment.category;
    const color = GARMENT_COLORS[category];

    if (!color) return;

    const width = getMannequinWidth(frame, bodyType);
    const bounds = getGarmentBounds(category, width);

    // Replace only the previous garment in this category.
    const existing = equippedGarmentsRef.current[category];

    if (existing) {
      canvas.remove(existing);
    }

    const garment = new fabric.Rect({
      ...bounds,
      fill: color,
      stroke: "#555",
      strokeWidth: 1,
      selectable: false,
      evented: false,
    });

    garment.layerType = category;

    canvas.add(garment);
    equippedGarmentsRef.current[category] = garment;

    // Update the boundary for future brush strokes.
    const boundary = garmentBoundaryRef.current;

    if (boundary) {
      boundary.set(bounds);
      boundary.setCoords();
    }

    sortCanvasLayers(canvas);
  }, [selectedGarment]);
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    const mannequin = mannequinRef.current;

    if (!canvas || !mannequin) return;

    const width = getMannequinWidth(frame, bodyType);

    // Update the existing mannequin rather than clearing canvas.
    mannequin.set({
      left: 300 - width / 2,
      width,
    });

    mannequin.setCoords();

    // Reposition clothing to fit the newly selected body.
    Object.entries(equippedGarmentsRef.current).forEach(
      ([category, garment]) => {
        const bounds = getGarmentBounds(category, width);

        if (bounds) {
          garment.set(bounds);
          garment.setCoords();
        }
      }
    );

    // Keep the active drawing boundary aligned.
    if (selectedGarment && garmentBoundaryRef.current) {
      const bounds = getGarmentBounds(
        selectedGarment.category,
        width
      );

      if (bounds) {
        garmentBoundaryRef.current.set(bounds);
        garmentBoundaryRef.current.setCoords();
      }
    }

    sortCanvasLayers(canvas);
  }, [frame, bodyType, selectedGarment]);



  // Keep the brush in sync with the controls
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
      <div style={{ marginBottom: 10, display: "flex", gap: 16, alignItems: "center" }}>
        <label>
          Width: {strokeWidth}
          <input
            type="range"
            min="1"
            max="50"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
          />
        </label>

        <label>
          Color:
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            disabled={isEraser}
          />
        </label>

        <label>
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

                 <button onClick={() => setIsEraser((prev) => !prev)}>
          {isEraser ? "Switch to Brush" : "Switch to Eraser"}
        </button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <strong>FPS: {fps}</strong>
      </div>

      <canvas ref={canvasElRef} />
    </div>
  );
}
