
import { v4 as uuidv4 } from "uuid";
import { Document } from "@/components/DocumentList";

// This service handles document uploading and management
// In a real application, this would connect to your backend API

// Simulated document storage
let documents: Document[] = [
  {
    id: uuidv4(),
    name: "User Authentication Guide.pdf",
    size: 1258291,
    uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: uuidv4(),
    name: "API Documentation.pdf",
    size: 3528192,
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: uuidv4(),
    name: "System Architecture Overview.pdf",
    size: 2193842,
    uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

// Get all documents
export const getDocuments = async (): Promise<Document[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...documents]);
    }, 500);
  });
};

// Upload new documents
export const uploadDocuments = async (files: File[]): Promise<Document[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDocuments = files.map((file) => ({
        id: uuidv4(),
        name: file.name,
        size: file.size,
        uploadedAt: new Date(),
      }));
      
      documents = [...documents, ...newDocuments];
      resolve(newDocuments);
    }, 1500);
  });
};

// Delete a document
export const deleteDocument = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      documents = documents.filter((doc) => doc.id !== id);
      resolve();
    }, 500);
  });
};

// Get document details
export const getDocumentDetails = async (id: string): Promise<Document | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const document = documents.find((doc) => doc.id === id);
      resolve(document);
    }, 300);
  });
};
