import { v4 as uuidv4 } from "uuid";
import { Document } from "@/components/DocumentList";

// API endpoint
const API_URL = 'http://localhost:3001';

// This service handles document uploading and management
// In a real application, this would connect to your backend API

interface StoredDocument extends Document {
  storedName: string;
}

// Document storage in memory (in a real app, this would be a database)
let documents: StoredDocument[] = [
  {
    id: uuidv4(),
    name: "User Authentication Guide.pdf",
    size: 1258291,
    uploadedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    storedName: "User Authentication Guide.pdf",
  },
  {
    id: uuidv4(),
    name: "API Documentation.pdf",
    size: 3528192,
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    storedName: "API Documentation.pdf",
  },
  {
    id: uuidv4(),
    name: "System Architecture Overview.pdf",
    size: 2193842,
    uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    storedName: "System Architecture Overview.pdf",
  },
];

// Get all documents
export const getDocuments = async (): Promise<Document[]> => {
  return documents;
};

// Upload new documents
export const uploadDocuments = async (files: File[]): Promise<Document[]> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const uploadedFiles = await response.json();
    const newDocuments: StoredDocument[] = uploadedFiles.map(file => ({
      id: file.id,
      name: file.originalName,
      size: file.size,
      uploadedAt: new Date(file.uploadedAt),
      storedName: file.storedName
    }));

    documents = [...documents, ...newDocuments];
    return newDocuments;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw new Error('Failed to upload files');
  }
};

// Delete a document
export const deleteDocument = async (id: string): Promise<void> => {
  const doc = documents.find(d => d.id === id);
  if (!doc) {
    throw new Error('Document not found');
  }

  try {
    const response = await fetch(`${API_URL}/files/${doc.storedName}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Delete failed');
    }

    documents = documents.filter(d => d.id !== id);
  } catch (error) {
    console.error(`Error deleting file ${doc.name}:`, error);
    throw new Error(`Failed to delete file ${doc.name}`);
  }
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
