
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, FileText, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUploadComplete: (files: File[]) => void;
  maxFiles?: number;
  allowedTypes?: string[];
  className?: string;
}

const FileUpload = ({
  onUploadComplete,
  maxFiles = 5,
  allowedTypes = ["application/pdf"],
  className
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };

  const handleUploadAreaClick = () => {
    // Explicitly trigger a click on the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processFiles = (newFiles: File[]) => {
    // Filter for allowed file types
    const validFiles = newFiles.filter(file => 
      allowedTypes.includes(file.type)
    );
    
    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are allowed.",
        variant: "destructive"
      });
    }
    
    // Check if adding these files would exceed the max
    if (files.length + validFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can only upload ${maxFiles} files at a time.`,
        variant: "destructive"
      });
      
      // Only add files up to the max
      const remainingSlots = maxFiles - files.length;
      if (remainingSlots > 0) {
        setFiles(prev => [...prev, ...validFiles.slice(0, remainingSlots)]);
      }
    } else {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one PDF file to upload.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(timer);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      // In a real application, this is where you would upload the files to your server
      // For now, we're just simulating an upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(timer);
      setUploadProgress(100);
      
      setTimeout(() => {
        onUploadComplete(files);
        toast({
          title: "Upload complete",
          description: `Successfully uploaded ${files.length} file${files.length > 1 ? 's' : ''}.`,
        });
        setFiles([]);
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      clearInterval(timer);
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your files. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div
        onClick={handleUploadAreaClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ease-in-out",
          isDragging 
            ? "border-primary bg-primary/5 scale-[1.01]" 
            : "border-border hover:border-primary/50 hover:bg-secondary/50",
          isUploading && "pointer-events-none opacity-60"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".pdf"
          multiple
          className="hidden"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">
              {isDragging ? "Drop files here" : "Upload PDF documents"}
            </p>
            <p className="text-sm text-muted-foreground">
              Drag and drop or click to browse
            </p>
          </div>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Selected files ({files.length}/{maxFiles})</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div 
                key={index}
                className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg animate-fade-in"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="truncate max-w-[180px] sm:max-w-xs">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {isUploading && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      <div className="flex justify-end">
        {files.length > 0 && !isUploading && (
          <Button onClick={handleSubmit} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload {files.length} file{files.length > 1 ? 's' : ''}
          </Button>
        )}
        
        {isUploading && uploadProgress === 100 && (
          <Button disabled className="gap-2 bg-green-600 hover:bg-green-700">
            <Check className="h-4 w-4" />
            Upload Complete
          </Button>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
