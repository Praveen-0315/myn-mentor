
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut, Maximize, Minimize } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiagramDisplayProps {
  diagramSvg: string;
  title?: string;
  className?: string;
}

const DiagramDisplay = ({
  diagramSvg,
  title,
  className,
}: DiagramDisplayProps) => {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    const svg = new Blob([diagramSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svg);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = title ? `${title.replace(/\s+/g, "-").toLowerCase()}.svg` : "diagram.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className={cn(
        "border rounded-lg overflow-hidden bg-white",
        isFullscreen && "fixed inset-4 z-50 bg-white shadow-xl",
        className
      )}
    >
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <h3 className="text-sm font-medium truncate">
          {title || "Diagram"}
        </h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs px-2">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="overflow-auto p-4 flex items-center justify-center bg-zinc-50">
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
          className="transition-transform duration-200 ease-in-out"
          dangerouslySetInnerHTML={{ __html: diagramSvg }}
        />
      </div>
    </div>
  );
};

export default DiagramDisplay;
