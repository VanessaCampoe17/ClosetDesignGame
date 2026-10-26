import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

//week 5: keeps the clothing in order 
const LAYER_ORDER = 
{
  mannequin: 0,
  bottoms: 1,
  tops: 2,
  headwear: 3,
  accessories: 3,
  boundary: 4,

};
//week 5: sorts the objects on the canvas
function sortCanvasLayers(canvas)
{
  const objects = [...canvas.getObjects()];

  const sorted = objects.sort((a, b) => {
    const layerA = LAYER_ORDER[a.layerType] ?? 2;
    const layerB = LAYER_ORDER[b.layerType] ?? 2;
    
    return layerA - layerB;
  });
  sorted.forEach((object, index) =>  {
    canvas.moveObjectTo(object, index);
  });
  canvas.requestRenderAll();

} 
//edditing this part to get it to receive the selected garment   
export default function DesignCanvas({selectedGarment}) {
  const canvasElRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const garmentBoundaryRef = useRef(null); // holds the current clip shape
  const garmentRef = useRef(null); //week 5 change
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
    //week 5: put the manneqquin in the lowest layer
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
    //boundary sticks above the clothing
    garmentBoundary.layerType = "boundary";
    canvas.add(garmentBoundary);
    garmentBoundaryRef.current = garmentBoundary;

    sortCanvasLayers(canvas);

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
      //place the drawing above the cltohes
      path.layerType = "accessories";
      sortCanvasLayers(canvas);
      //canvas.requestRenderAll();
    };

    canvas.on("path:created", handlePathCreated);

  return () => {
  cancelAnimationFrame(animationFrameId);
  canvas.off("path:created", handlePathCreated);
  canvas.dispose();
  fabricCanvasRef.current = null;
};
  }, []);
  //week 5: changes the clothing when a certain garment is selected
  useEffect(() =>{
  const canvas = fabricCanvasRef.current;
  if(!canvas) return;

  let cancelled = false;

  const showGarment = async () =>
  {
    //remove the old garment beforehand
    if(garmentRef.current)
    {
        canvas.remove(garmentRef.current);
        garmentRef.current = null;
    }

  if(!selectedGarment)
  {
    sortCanvasLayers(canvas)
    return;
  }

  let garment;
  
  try {

  //load the garment
  if(!selectedGarment.svgPath)
    {
      throw new Error("No SVG path found");
    }
  const result = await fabric.loadSVGFromURL(
    selectedGarment.svgPath
  );
  
  if(cancelled) return; 

  const objects = result.objects.filter(Boolean);

  if(!objects.length)
  {
    throw new Error("SVG contains no shapes");
  }

  garment = fabric.util.groupSVGElements(
    objects, 
    result.options
  );


  garment.scaleToWidth(180);
 } catch (error){
  if(cancelled) return;
  //temporary garment  
  garment = new fabric.Rect({
   width:160,
   height:
    selectedGarment.category === "bottoms"
     ? 180
     : 140,
  fill: "#b0c4de",
  opacity: 0.8,
});
  console.warn("Using garment placeholder:", error );
}
  if (cancelled) return;

  garment.set({
    originX: "center",
    left: 300,
    top: selectedGarment.anchorCoords?.y ?? 270,
    selectable: false,
    evented: false,
  });

  //week 5: give the clothing its correct layer
  garment.layerType = selectedGarment.category;
  garmentRef.current = garment;
  canvas.add(garment);

  sortCanvasLayers(canvas);
};

  showGarment();

  return() => {
    cancelled = true;
};
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