import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

const LAYER_ORDER = {
  mannequin: 0,
  bottoms: 1,
  tops: 2,
  headwear: 3,
  accessories: 3,
  boundary: 4,
};

function sortCanvasLayers(canvas) {
  const objects = [...canvas.getObjects()];

  const sorted = objects.sort((a, b) => {
    const layerA = LAYER_ORDER[a.layerType] ?? 2;
    const layerB = LAYER_ORDER[b.layerType] ?? 2;

    return layerA - layerB;
  });

  sorted.forEach((object, index) => {
    canvas.moveObjectTo(object, index);
  });

  canvas.requestRenderAll();
}

export default function DesignCanvas({ selectedGarment }) {
  const canvasElRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const garmentBoundaryRef = useRef(null); // holds the current clip shape

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
    mannequin.layerType = "mannequin";
    canvas.add(mannequin);

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
    garmentBoundary.layerType = "boundary";
    canvas.add(garmentBoundary);
    garmentBoundaryRef.current = garmentBoundary;

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
      path.layerType = "tops";
      sortCanvasLayers(canvas);
    };

    canvas.on("path:created", handlePathCreated);
    // Automatically sort layers whenever a new object is added
    const handleObjectAdded = () => {
    sortCanvasLayers(canvas);
    };

   canvas.on("object:added", handleObjectAdded);

  return () => {
  cancelAnimationFrame(animationFrameId);
  canvas.off("path:created", handlePathCreated);
  canvas.off("object:added", handleObjectAdded);
  canvas.dispose();
};
  }, []);

// Add selected clothing to the canvas
useEffect(() => {
  const canvas = fabricCanvasRef.current;

  if (!canvas || !selectedGarment) return;

  // Determine the clothing category
  const category = selectedGarment.category;

  // Temporary placeholder shapes for clothing
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

  // Assign the correct layer
  garment.layerType = category;

  // Add garment to canvas
  canvas.add(garment);

  // Sort all objects by layer
  sortCanvasLayers(canvas);

}, [selectedGarment]);

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
