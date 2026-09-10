import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

export default function DesignCanvas() {
  const canvasElRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const garmentBoundaryRef = useRef(null); // holds the current clip shape

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

    const mannequin = new fabric.Rect({
      left: 200,
      top: 250,
      width: 200,
      height: 350,
      fill: "#dcdcdc",
      selectable: false,
    });
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
    canvas.add(garmentBoundary);
    garmentBoundaryRef.current = garmentBoundary;

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
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
      canvas.off("path:created", handlePathCreated);
      canvas.dispose();
    };
  }, []);

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

      <canvas ref={canvasElRef} />
    </div>
  );
}