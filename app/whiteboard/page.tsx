"use client"
import React, { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PencilIcon, EraserIcon, UndoIcon, RedoIcon, TrashIcon, XIcon, UsersIcon, DownloadIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

// FIXED: Corrected the function signature
export function Whiteboard() {
    const router = useRouter()
     const handleHome = () => {
    router.push('/home');
  };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      // Fill with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Save initial state
      saveToHistory();
    };

    setContext(ctx);
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Save canvas state to history
  const saveToHistory = () => {
    if (!canvasRef.current || !context) return;
    const canvas = canvasRef.current;
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Remove any states after current step if we've gone back in history
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  // Undo action
  const handleUndo = () => {
    if (historyStep > 0 && context && canvasRef.current) {
      setHistoryStep(historyStep - 1);
      context.putImageData(history[historyStep - 1], 0, 0);
    }
  };

  // Redo action
  const handleRedo = () => {
    if (historyStep < history.length - 1 && context && canvasRef.current) {
      setHistoryStep(historyStep + 1);
      context.putImageData(history[historyStep + 1], 0, 0);
    }
  };

  // Clear the canvas
  const handleClear = () => {
    if (!context || !canvasRef.current) return;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveToHistory();
  };

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context) return;
    setIsDrawing(true);
    const { offsetX, offsetY } = getCoordinates(e);
    context.beginPath();
    context.moveTo(offsetX, offsetY);

    // Set drawing styles
    if (tool === 'pencil') {
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
    } else if (tool === 'eraser') {
      context.strokeStyle = '#ffffff';
      context.lineWidth = lineWidth * 3;
    }
    context.lineCap = 'round';
    context.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    const { offsetX, offsetY } = getCoordinates(e);
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveToHistory();
  };

  // Helper to get coordinates from mouse or touch event
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { offsetX: 0, offsetY: 0 };
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Mouse event
    if ('nativeEvent' in e && 'offsetX' in e.nativeEvent) {
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY
      };
    }

    // Touch event
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
      };
    }

    return { offsetX: 0, offsetY: 0 };
  };

  // Export whiteboard as image
  const handleExport = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col h-screen bg-[#f9f9f9]">
      {/* Header */}
      <div className="bg-white p-4 flex justify-between items-center shadow-sm">
        <div>
          <h2 className="font-bold text-lg text-[#321210]">
            Interactive Whiteboard
          </h2>
          <p className="text-sm text-gray-600">Advanced Mathematics</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-[#c1f52f] px-3 py-1 rounded-full text-[#321210] font-medium text-sm flex items-center">
            <UsersIcon className="h-4 w-4 mr-1" />
            <span>4 Participants</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleHome}  className="flex items-center">
            <XIcon className="h-4 w-4 mr-1" />
            Exit
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-2 flex items-center space-x-2 shadow-sm">
        <div className="flex space-x-1">
          <Button
            className={`p-2 rounded-md ${tool === 'pencil' ? 'bg-[#c1f52f]' : 'bg-gray-100'}`}
            onClick={() => setTool('pencil')}
          >
            <PencilIcon className={`h-5 w-5 ${tool === 'pencil' ? 'text-[#321210]' : 'text-gray-500'}`} />
          </Button>
          <Button
            className={`p-2 rounded-md ${tool === 'eraser' ? 'bg-[#c1f52f]' : 'bg-gray-100'}`}
            onClick={() => setTool('eraser')}
          >
            <EraserIcon className={`h-5 w-5 ${tool === 'eraser' ? 'text-[#321210]' : 'text-gray-500'}`} />
          </Button>
        </div>

        <div className="h-6 border-l border-gray-300"></div>

        <div className="flex space-x-1">
          <Button
            className="p-2 rounded-md bg-gray-100"
            onClick={handleUndo}
            disabled={historyStep <= 0}
          >
            <UndoIcon className="h-5 w-5 text-gray-500" />
          </Button>
          <Button
            className="p-2 rounded-md bg-gray-100"
            onClick={handleRedo}
            disabled={historyStep >= history.length - 1}
          >
            <RedoIcon className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        <div className="h-6 border-l border-gray-300"></div>

        <div className="flex items-center space-x-2">
          <Input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            className="w-8 h-8 rounded-md cursor-pointer"
          />
          <select
          title="option"
            value={lineWidth}
            onChange={e => setLineWidth(Number(e.target.value))}
            className="bg-gray-100 rounded-md p-1 text-sm"
          >
            <option value="1">Thin</option>
            <option value="3">Medium</option>
            <option value="5">Thick</option>
          </select>
        </div>

        <div className="ml-auto flex space-x-1">
          <Button className="p-2 rounded-md bg-gray-100 flex items-center" onClick={handleExport}>
            <DownloadIcon className="h-5 w-5 text-gray-500" />
          </Button>
          <Button className="p-2 rounded-md bg-gray-100 flex items-center" onClick={handleClear}>
            <TrashIcon className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </div>
  );
}