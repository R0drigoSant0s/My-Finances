import { useState, useEffect, useRef } from "react";

type Tool = "pencil" | "eraser" | "rectangle" | "circle" | "line" | "text" | "fill" | "select";

interface UsePaintCanvasProps {
  currentTool: Tool;
  currentColor: string;
  brushSize: number;
}

export function usePaintCanvas({ currentTool, currentColor, brushSize }: UsePaintCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const undoStackRef = useRef<string[]>([]);
  const redoStackRef = useRef<string[]>([]);
  const [canvasInitialized, setCanvasInitialized] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      // Redraw canvas with saved state if available
      if (undoStackRef.current.length > 0) {
        const img = new Image();
        img.onload = function () {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = undoStackRef.current[undoStackRef.current.length - 1];
      } else {
        // Fill with white background
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    setCanvasInitialized(true);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Save canvas state
  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Limit undo stack size
    if (undoStackRef.current.length >= 10) {
      undoStackRef.current.shift(); // Remove oldest state
    }

    undoStackRef.current.push(canvas.toDataURL());
    redoStackRef.current = []; // Clear redo stack after new action
  };

  // Set up canvas event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvasInitialized) return;

    // Update cursor based on selected tool
    updateCursor();

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      isDrawingRef.current = true;
      const position = getPosition(e);
      startXRef.current = position.x;
      startYRef.current = position.y;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // For some tools like pencil, we want to draw a single dot
      if (currentTool === "pencil") {
        ctx.beginPath();
        ctx.arc(startXRef.current, startYRef.current, brushSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = currentColor;
        ctx.fill();
      }

      // Save state for eraser and pencil
      if (currentTool === "pencil" || currentTool === "eraser") {
        ctx.beginPath();
        ctx.moveTo(startXRef.current, startYRef.current);
      }
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;

      const position = getPosition(e);
      const currentX = position.x;
      const currentY = position.y;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      switch (currentTool) {
        case "pencil":
          drawFreehand(ctx, currentX, currentY);
          break;
        case "eraser":
          erase(ctx, currentX, currentY);
          break;
        case "rectangle":
          drawRectanglePreview(ctx, currentX, currentY);
          break;
        case "circle":
          drawCirclePreview(ctx, currentX, currentY);
          break;
        case "line":
          drawLinePreview(ctx, currentX, currentY);
          break;
        // Implement other tools as needed
      }
    };

    const stopDrawing = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;

      if (["rectangle", "circle", "line"].includes(currentTool)) {
        // Finalize shape drawing
        const position = getPosition(e);
        const currentX = position.x;
        const currentY = position.y;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        switch (currentTool) {
          case "rectangle":
            drawRectangle(ctx, currentX, currentY);
            break;
          case "circle":
            drawCircle(ctx, currentX, currentY);
            break;
          case "line":
            drawLine(ctx, currentX, currentY);
            break;
        }
      }

      isDrawingRef.current = false;
      saveState();
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      startDrawing(e);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      draw(e);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      stopDrawing(e);
    };

    const handleClearCanvas = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
    };

    const handleUndo = () => {
      if (undoStackRef.current.length <= 1) return; // Keep at least initial state

      redoStackRef.current.push(undoStackRef.current.pop()!);
      const prevState = undoStackRef.current[undoStackRef.current.length - 1];
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = prevState;
    };

    const handleRedo = () => {
      if (redoStackRef.current.length === 0) return;

      const nextState = redoStackRef.current.pop()!;
      undoStackRef.current.push(nextState);
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = nextState;
    };

    // Add event listeners
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("saveCanvasState", saveState);
    window.addEventListener("undoCanvas", handleUndo);
    window.addEventListener("redoCanvas", handleRedo);
    window.addEventListener("clearCanvas", handleClearCanvas);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("saveCanvasState", saveState);
      window.removeEventListener("undoCanvas", handleUndo);
      window.removeEventListener("redoCanvas", handleRedo);
      window.removeEventListener("clearCanvas", handleClearCanvas);
    };
  }, [currentTool, currentColor, brushSize, canvasInitialized]);

  // Helper functions
  const updateCursor = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.classList.remove("cursor-pencil", "cursor-eraser", "cursor-fill");

    if (currentTool === "pencil") {
      canvas.classList.add("cursor-pencil");
    } else if (currentTool === "eraser") {
      canvas.classList.add("cursor-eraser");
    } else if (currentTool === "fill") {
      canvas.classList.add("cursor-fill");
    } else {
      canvas.style.cursor = "crosshair";
    }
  };

  const getPosition = (event: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if (event instanceof TouchEvent) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    }

    return {
      x: (event as MouseEvent).clientX - rect.left,
      y: (event as MouseEvent).clientY - rect.top,
    };
  };

  const drawFreehand = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = currentColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const erase = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = "#FFFFFF"; // White for eraser

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const drawRectanglePreview = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Restore canvas to previous state
    if (undoStackRef.current.length > 0) {
      const img = new Image();
      img.onload = function () {
        if (!canvasRef.current) return;
        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        // Draw the preview rectangle
        ctx.beginPath();
        ctx.rect(startXRef.current, startYRef.current, x - startXRef.current, y - startYRef.current);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.stroke();
      };
      img.src = undoStackRef.current[undoStackRef.current.length - 1];
    }
  };

  const drawRectangle = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.rect(startXRef.current, startYRef.current, x - startXRef.current, y - startYRef.current);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.stroke();
  };

  const drawCirclePreview = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Restore canvas to previous state
    if (undoStackRef.current.length > 0) {
      const img = new Image();
      img.onload = function () {
        if (!canvasRef.current) return;
        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        // Draw the preview circle
        const radius = Math.sqrt(Math.pow(x - startXRef.current, 2) + Math.pow(y - startYRef.current, 2));
        ctx.beginPath();
        ctx.arc(startXRef.current, startYRef.current, radius, 0, Math.PI * 2);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.stroke();
      };
      img.src = undoStackRef.current[undoStackRef.current.length - 1];
    }
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const radius = Math.sqrt(Math.pow(x - startXRef.current, 2) + Math.pow(y - startYRef.current, 2));
    ctx.beginPath();
    ctx.arc(startXRef.current, startYRef.current, radius, 0, Math.PI * 2);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.stroke();
  };

  const drawLinePreview = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Restore canvas to previous state
    if (undoStackRef.current.length > 0) {
      const img = new Image();
      img.onload = function () {
        if (!canvasRef.current) return;
        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        // Draw the preview line
        ctx.beginPath();
        ctx.moveTo(startXRef.current, startYRef.current);
        ctx.lineTo(x, y);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.stroke();
      };
      img.src = undoStackRef.current[undoStackRef.current.length - 1];
    }
  };

  const drawLine = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.moveTo(startXRef.current, startYRef.current);
    ctx.lineTo(x, y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.stroke();
  };

  return { canvasRef };
}
