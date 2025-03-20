
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, MoreHorizontal, FileText, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface Document {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
}

interface DocumentListProps {
  documents: Document[];
  onDeleteDocument?: (id: string) => void;
  onAddDocument?: () => void;
  className?: string;
}

const DocumentList = ({
  documents,
  onDeleteDocument,
  onAddDocument,
  className,
}: DocumentListProps) => {
  const { toast } = useToast();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleDelete = (id: string) => {
    onDeleteDocument?.(id);
    toast({
      title: "Document deleted",
      description: "The document has been removed from the system.",
    });
  };

  const handlePreview = (document: Document) => {
    setSelectedDocument(document);
    setPreviewOpen(true);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Documents</h3>
        {onAddDocument && (
          <Button variant="outline" size="sm" onClick={onAddDocument} className="gap-1">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/60" />
          <p className="mt-4 text-muted-foreground">No documents uploaded yet</p>
          {onAddDocument && (
            <Button onClick={onAddDocument} variant="link" className="mt-2">
              Upload your first document
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 bg-muted/50 p-3 text-sm font-medium text-muted-foreground">
            <div className="col-span-5 sm:col-span-6">Name</div>
            <div className="col-span-4 sm:col-span-3 text-right sm:text-left">Size</div>
            <div className="col-span-2 hidden sm:block">Uploaded</div>
            <div className="col-span-3 sm:col-span-1"></div>
          </div>

          <div className="divide-y">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="grid grid-cols-12 gap-4 p-3 items-center hover:bg-muted/20 transition-colors"
              >
                <div className="col-span-5 sm:col-span-6 flex items-center gap-2">
                  <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="font-medium truncate">{doc.name}</span>
                </div>
                <div className="col-span-4 sm:col-span-3 text-right sm:text-left text-sm text-muted-foreground">
                  {formatFileSize(doc.size)}
                </div>
                <div className="col-span-2 hidden sm:block text-sm text-muted-foreground">
                  {formatDate(doc.uploadedAt)}
                </div>
                <div className="col-span-3 sm:col-span-1 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handlePreview(doc)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(doc.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
            <DialogDescription>
              Uploaded on {selectedDocument && formatDate(selectedDocument.uploadedAt)}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-muted/30 rounded-lg border h-[60vh] flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              PDF preview would be displayed here
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentList;
