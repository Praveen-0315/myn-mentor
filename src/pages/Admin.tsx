import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import FileUpload from "@/components/FileUpload";
import DocumentList from "@/components/DocumentList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, RefreshCcw, Database, Shield } from "lucide-react";
import { uploadDocuments, getDocuments, deleteDocument } from "@/utils/documentService";
import { Document } from "@/components/DocumentList";
import { cn } from "@/lib/utils";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("documents");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Error loading documents:", error);
      toast({
        title: "Error",
        description: "Failed to load documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadComplete = async (files: File[]) => {
    try {
      const newDocs = await uploadDocuments(files);
      setDocuments((prev) => [...prev, ...newDocs]);
      
      toast({
        title: "Upload Complete",
        description: `${files.length} document${files.length !== 1 ? "s" : ""} uploaded successfully.`,
      });
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your documents.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the document.",
        variant: "destructive",
      });
    }
  };

  const handleTrainModel = () => {
    if (documents.length === 0) {
      toast({
        title: "No Documents",
        description: "Please upload documents before training the model.",
        variant: "destructive",
      });
      return;
    }
    
    setIsTraining(true);
    
    // Simulate training process
    setTimeout(() => {
      setIsTraining(false);
      toast({
        title: "Training Complete",
        description: "The AI model has been trained with your documents.",
      });
    }, 3000);
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your documents and train the AI assistant.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Upload Documents</CardTitle>
                  <CardDescription>
                    Upload PDF documents to train the AI assistant.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onUploadComplete={handleUploadComplete} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Train AI Model</CardTitle>
                  <CardDescription>
                    Process your documents and train the AI assistant.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Documents</span>
                      <span className="text-sm text-muted-foreground">
                        {documents.length} uploaded
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.min(
                            (documents.length / 5) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {documents.length === 0
                        ? "Upload documents to train the AI"
                        : documents.length < 3
                        ? "We recommend uploading at least 3 documents"
                        : "Ready to train"}
                    </p>
                  </div>

                  <Button
                    onClick={handleTrainModel}
                    className="w-full gap-2"
                    disabled={isTraining || documents.length === 0}
                  >
                    {isTraining ? (
                      <>
                        <RefreshCcw className="h-4 w-4 animate-spin" />
                        Training...
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4" />
                        Train AI Model
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <DocumentList
                documents={documents}
                onDeleteDocument={handleDeleteDocument}
              />
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage access control and security settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Data Encryption</div>
                      <div className="text-xs text-muted-foreground">
                        All uploaded documents are encrypted at rest
                      </div>
                    </div>
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Access Control</div>
                      <div className="text-xs text-muted-foreground">
                        Manage who can access the assistant
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">
                      Configure
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">Data Retention</div>
                      <div className="text-xs text-muted-foreground">
                        Control how long data is stored
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Model Configuration</CardTitle>
                <CardDescription>
                  Customize how the AI processes your documents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className={cn(
                      "flex flex-col items-center justify-center rounded-lg border p-4 hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer",
                      "border-primary bg-primary/5"
                    )}>
                      <div className="font-medium mb-1">Balanced</div>
                      <div className="text-xs text-muted-foreground">Recommended</div>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4 hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="font-medium mb-1">Creative</div>
                      <div className="text-xs text-muted-foreground">More flexible</div>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border p-4 hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="font-medium mb-1">Precise</div>
                      <div className="text-xs text-muted-foreground">Most accurate</div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4">
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Admin;