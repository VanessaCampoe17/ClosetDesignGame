import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { restoreCanvas, serializeCanvas } from "../utils/canvasSerialization";

//Gets the mannequin and clothing information.
import clothingCatalog from "../data/clothingCatalog.json";
// UPDATED Week 4: Keeps the mannequin behind the clothes.
const LAYER_ORDER = {
  mannequin: 0,
  bottoms: 1,
  tops: 2,
  headwear: 3,
  accessories: 4,
  boundary: 5,
};
  // Adjusts clothing position and size.
const GARMENT_FIT = {
  tops: {
    x: 300,
    y: 210,
    width: 145,
    height: 175,
  },
  bottoms: {
    x: 300,
    y: 385,
    width: 125,
    height: 165,
  },
  shoes: {
    x: 300,
    y: 690,
    width: 90,
    height: 55,
  },
    headwear: {
    x: 300,
    y: 60,
    width: 95,
    height: 50,
  },
};

//UPDATED (Increment 2): Body measurements from the mannequin SVGs.
const BODY_LANDMARKS = {
  feminine: {
    slim:    { shoulders: 88, hips: 84, shoulderY: 195, hipY: 430 },
    average: { shoulders: 100, hips: 100, shoulderY: 195, hipY: 430 },
    broad:   { shoulders: 116, hips: 120, shoulderY: 195, hipY: 430 },
  },
  masculine: {
    slim:    { shoulders: 110, hips: 72, shoulderY: 192, hipY: 430 },
    average: { shoulders: 130, hips: 84, shoulderY: 192, hipY: 430 },
    broad:   { shoulders: 156, hips: 100, shoulderY: 192, hipY: 430 },
  },
  neutral: {
    slim:    { shoulders: 92, hips: 76, shoulderY: 195, hipY: 430 },
    average: { shoulders: 110, hips: 90, shoulderY: 195, hipY: 430 },
    broad:   { shoulders: 132, hips: 108, shoulderY: 195, hipY: 430 },
  },
};
//UPDATED: Gets the body measurements for the selected mannequin.
function getBodyLandmarks(frame, bodyType) {
  return BODY_LANDMARKS[frame]?.[bodyType]
    ?? BODY_LANDMARKS.feminine.average;
}
//Week 5: Calculates clothing size for each mannequin.
function getGarmentFit(garment, frame, bodyType) {
  const body = getBodyLandmarks(frame, bodyType);

  //Start with the existing clothing positions.
  const base = GARMENT_FIT[garment.category];

  if (!base) return null;

  //Jackets need to cover the shoulders.
  if (garment.id === "1950s-na-greaser-jacket-01") {
    return {
      ...base,
      width: body.shoulders * 1.5,
      height: 175,
      y: 205,
    };
  }

  //Corsets sit lower and fit closer to the waist.
  if (garment.id === "1890s-eu-victorian-corset-01") {
    return {
      ...base,
      width: body.shoulders * 0.95,
      height: 155,
      y: 235,
    };
  }

  // Skirts fit around the hips.
  if (garment.id === "1990s-ea-harajuku-skirt-01") {
    return {
      ...base,
      width: body.hips * 1.83,
      height: 190,
      y: 400,
    };
  }

  return base;
}
//Gets the layer type from the saved data.
function getLayer(object) {
  return object.data?.layerType ?? object.layerType ?? "accessories";
}

//Sorts the canvas objects into the right order.
function sortCanvasLayers(canvas) {
  const objects = [...canvas.getObjects()];

  objects.sort((a, b) => {
    return (
      (LAYER_ORDER[getLayer(a)] ?? 4) -
      (LAYER_ORDER[getLayer(b)] ?? 4)
    );
  });

  objects.forEach((object, index) => {
    canvas.moveObjectTo(object, index);
  });

  canvas.requestRenderAll();
}

//Loads an SVG file so Fabric can display it.
async function loadSVG(path) {
  const result = await fabric.loadSVGFromURL(path);

  const objects = result.objects.filter(Boolean);

  if (objects.length === 0) {
    throw new Error(`Could not load SVG: ${path}`);
  }

  return fabric.util.groupSVGElements(objects, result.options);
}
  //Uses the clothing shape for drawing clips.
async function makeGarmentClip(garment) {
  const clip = await garment.clone();

  //Keep the clip in the same position as the clothing.
  clip.set({
    absolutePositioned: true,
    selectable: false,
    evented: false,
  });

  clip.setCoords();
  return clip;
}

  //Moves the drawing boundary to the selected garment.
function updateGarmentBoundary(canvas, boundary, garment) {
  if (!boundary || !garment) return;

  //Use the garment's actual position and size.
  garment.setCoords();
  const bounds = garment.getBoundingRect();

  boundary.set({
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
    scaleX: 1,
    scaleY: 1,
    originX: "left",
    originY: "top",
    visible: true,
  });

  boundary.setCoords();
  canvas.requestRenderAll();
}

  //Gets the mannequin and clothing
// settings that App.jsx already sends to the canvas.


export default function DesignCanvas({
  selectedGarment,
  frame = "feminine",
  bodyType = "average",
  onRegisterCanvas,
  loadedCanvasData,
}) {

  const canvasElRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const garmentBoundaryRef = useRef(null);

  //Keeps track of the mannequin currently on the canvas.
  const mannequinRef = useRef(null);

  //Keeps track of equipped clothing by category.
  const equippedGarmentsRef = useRef({});
  //Tracks the garment being drawn on.
  const activeDrawingGarmentRef = useRef(null);

 //Keeps track of drawing history.
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);

  //Updates the undo/redo buttons.
  const [historyVersion, setHistoryVersion] = useState(0);

  //Prevents older SVG loads from replacing newer selections.
  const mannequinLoadRef = useRef(0);
    const garmentLoadRef = useRef(0);

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
    /*
    const mannequin = new fabric.Rect({
      left: 200,
      top: 250,
      width: 200,
      height: 350,
      fill: "#dcdcdc",
      selectable: false,
    });
    canvas.add(mannequin);
    */

    // Placeholder garment boundary
    const garmentBoundary = new fabric.Rect({
      left: 300,
      top: 200,
      width: 120,
      height: 140,
      fill: "transparent",
      stroke: "#888",
      strokeDashArray: [5, 5],
      data: { role: "garment-boundary", layerType: "boundary" },
      selectable: false,
      evented: false,
    });
    garmentBoundary.layerType = "boundary";
    canvas.add(garmentBoundary);
    garmentBoundaryRef.current = garmentBoundary;

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.decimate = 2;
    canvas.isDrawingMode = true;

        //Clip drawings to the actual clothing.
    const handlePathCreated = async (e) => {
    const path = e.path;


    //Draw on the currently selected garment.
  const target = activeDrawingGarmentRef.current;

  if (!target || !canvas.getObjects().includes(target)) {
    canvas.remove(path);
    canvas.requestRenderAll();
    return;
  }

  //Remember which clothing this drawing belongs to.
  path.data = {
    ...(path.data || {}),
    role: "garment-drawing",
    garmentId: target.data.garmentId,
    layerType: "accessories",
  };

  //Hides the stroke until the clothing clip is ready
  path.set({ visible: false });

  try {
    const clip = await makeGarmentClip(target);

    if (!canvas.getObjects().includes(path)) return;

    path.clipPath = clip;
    path.set({ visible: true });
    path.setCoords();

    //drawing for the undo button
    undoStackRef.current.push({
      type:"drawing",
      path: path,


    });
    redoStackRef.current = [];
    setHistoryVersion((previous) => previous + 1);

    sortCanvasLayers(canvas);
  } catch (error) {
    canvas.remove(path);
    console.error("Could not clip drawing:", error);
  }

  canvas.requestRenderAll();
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
  // NEW (Increment 2): Displays the mannequin based on frame and body type.
useEffect(() => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  const mannequinPath = clothingCatalog.mannequins?.[frame]?.[bodyType];

  if (!mannequinPath) {
    console.error("Could not find mannequin:", frame, bodyType);
    return;
  }

  const loadId = ++mannequinLoadRef.current;
  let cancelled = false;

  async function updateMannequin() {
    try {
      const mannequin = await loadSVG(mannequinPath);

      if (cancelled || loadId !== mannequinLoadRef.current) return;

      // UPDATED (Increment 2): Fits the mannequin inside the canvas.
// Keeps its original proportions instead of stretching it.
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    const scale = Math.min(
    (canvasWidth - 40) / mannequin.width,
    (canvasHeight - 40) / mannequin.height
      );
//);

    mannequin.set({
      originX: "center",
      originY: "center",
      scaleX: scale,
      scaleY: scale,
      selectable: false,
      evented: false,
      data: {
      role: "mannequin",
      layerType: "mannequin",
      frame, bodyType,
  },
});

// UPDATED: Places the mannequin in the middle of the drawing area.
mannequin.setPositionByOrigin(
  new fabric.Point(canvasWidth / 2, canvasHeight / 2),
  "center",
  "center"
);

mannequin.setCoords();
      

      // Removes the old mannequin before adding the new one.
      if (mannequinRef.current) {
        canvas.remove(mannequinRef.current);
      }

      mannequinRef.current = mannequin;
      canvas.add(mannequin);

      // UPDATED (Week 4): Keeps the mannequin behind the clothing.
      sortCanvasLayers(canvas);
    } catch (error) {
      console.error("Failed to load mannequin:", error);
    }
  }

  updateMannequin();

  return () => {
    cancelled = true;
  };
}, [frame, bodyType]);
    // NEW (Increment 2): Loads clothing when a garment is selected.
useEffect(() => {
  const canvas = fabricCanvasRef.current;
  if (!canvas || !selectedGarment?.svgPath) return;

  const loadId = ++garmentLoadRef.current;
  let cancelled = false;

  async function updateGarment() {
    try {
      const garment = await loadSVG(selectedGarment.svgPath);

      if (cancelled || loadId !== garmentLoadRef.current) return;

      const category = selectedGarment.category;
      const oldGarment = equippedGarmentsRef.current[category];

      // Starting size and position for testing the SVG.
      // We'll replace this with body-landmark fitting.
      const mannequin = mannequinRef.current;

      if (!mannequin) return;

      // UPDATED (Week 5): Fit clothing to the selected mannequin.
       const fit = getGarmentFit(selectedGarment, frame, bodyType);

      if (!fit) return;

      const scaleX = fit.width / garment.width;
      const scaleY = fit.height / garment.height;

      garment.set({
        originX: "center",
        originY: "center",
        scaleX: scaleX,
        scaleY: scaleY,
        selectable: false,
        evented: false,
        data: {
          role: "garment",
          layerType: category,
          garmentId: selectedGarment.id,
        },
      });
      // UPDATED (Week 5): Centers clothing over the correct body area.
        garment.setPositionByOrigin(
        new fabric.Point(fit.x, fit.y),
         "center",
         "center"
         );

      garment.setCoords();

      const removedDrawings = []; //save the clothing change

      if (oldGarment) {
           const oldId = oldGarment.data?.garmentId;

          //Only remove drawings when switching to a different garment.
           if (oldId !== selectedGarment.id) {
            canvas.getObjects()
              .filter((object) =>
                 object.data?.role === "garment-drawing" &&
                 object.data?.garmentId === oldId
          )
       .forEach((object) => {
        removedDrawings.push(object);
        canvas.remove(object);
          });
        }

        canvas.remove(oldGarment);
      
      }

      equippedGarmentsRef.current[category] = garment;
      canvas.add(garment);

        // Remember the clothing change for Undo/Redo.
          undoStackRef.current.push({
             type: "clothing",
            category: category,
            previousGarment: oldGarment || null,
             newGarment: garment,
             removedDrawings: removedDrawings,
});

redoStackRef.current = [];
setHistoryVersion((previous) => previous + 1);

          //Draw on the most recently selected garment.
        activeDrawingGarmentRef.current = garment;

      //Move the drawing boundary to this garment.
    
      updateGarmentBoundary(
       canvas,
       garmentBoundaryRef.current,
       garment
      );

      //Keeps the clothing in the right layer.
      sortCanvasLayers(canvas);
    } catch (error) {
      console.error("Failed to load clothing:", error);
    }
  }

  updateGarment();

  return () => {
    cancelled = true;
  };
}, [selectedGarment, frame, bodyType]);

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

           // Finds the currently equipped garment for drawing.
function refreshActiveGarment() {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  const garments = canvas.getObjects().filter(
    (object) => object.data?.role === "garment"
  );

  activeDrawingGarmentRef.current = garments.at(-1) || null;

  if (activeDrawingGarmentRef.current) {
    updateGarmentBoundary(
      canvas,
      garmentBoundaryRef.current,
      activeDrawingGarmentRef.current
    );
  } else if (garmentBoundaryRef.current) {
    garmentBoundaryRef.current.set({ visible: false });
  }
}

// Undo the last drawing or clothing change.
function handleUndo() {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  const action = undoStackRef.current.pop();
  if (!action) return;

  if (action.type === "drawing") {
    canvas.remove(action.path);
  }

  if (action.type === "clothing") {
    canvas.remove(action.newGarment);

    if (action.previousGarment) {
      canvas.add(action.previousGarment);
    }

    action.removedDrawings.forEach((path) => {
      canvas.add(path);
    });

    equippedGarmentsRef.current[action.category] =
      action.previousGarment || undefined;

    refreshActiveGarment();
  }

  redoStackRef.current.push(action);
  sortCanvasLayers(canvas);
  setHistoryVersion((previous) => previous + 1);
}

// Redo the last undone drawing or clothing change.
function handleRedo() {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  const action = redoStackRef.current.pop();
  if (!action) return;

  if (action.type === "drawing") {
    const garmentExists = canvas.getObjects().some(
      (object) =>
        object.data?.role === "garment" &&
        object.data?.garmentId === action.path.data?.garmentId
    );

    if (garmentExists) {
      canvas.add(action.path);
    }
  }

  if (action.type === "clothing") {
    if (action.previousGarment) {
      canvas.remove(action.previousGarment);
    }

    action.removedDrawings.forEach((path) => {
      canvas.remove(path);
    });

    canvas.add(action.newGarment);

    equippedGarmentsRef.current[action.category] =
      action.newGarment;

    refreshActiveGarment();
  }

  undoStackRef.current.push(action);
  sortCanvasLayers(canvas);
  setHistoryVersion((previous) => previous + 1);
}

  //Keep the brush in sync with the controls
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
      {/* Undo and redo drawing buttons. */}
<button
  onClick={handleUndo}
   disabled={undoStackRef.current.length === 0}
>
  Undo
</button>

<button
  onClick={handleRedo}
  disabled={redoStackRef.current.length === 0}
>
  Redo
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
