import { usePaintCanvas } from "@/hooks/usePaintCanvas";

type Tool = "pencil" | "eraser" | "rectangle" | "circle" | "line" | "text" | "fill" | "select";

interface CanvasAreaProps {
  currentTool: Tool;
  currentColor: string;
  brushSize: number;
}

export default function CanvasArea({ currentTool, currentColor, brushSize }: CanvasAreaProps) {
  const { canvasRef } = usePaintCanvas({
    currentTool,
    currentColor,
    brushSize,
  });

  return (
    <div className="flex-grow p-4 flex items-center justify-center bg-gray-200">
      <div className="relative w-full max-w-5xl aspect-[4/3] bg-white rounded-lg shadow-lg overflow-hidden">
        <canvas 
          id="paintCanvas" 
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </div>
  );
}
