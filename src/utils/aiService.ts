import { v4 as uuidv4 } from "uuid";
import { Message, ResponseType } from "@/components/ResponseDisplay";

// Simulated documents database
const documents: { id: string; name: string; content: string }[] = [];

// Function to add a document to the database
export const addDocument = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // In a real application, you would upload the file and process it here
    // This is just a simulation
    setTimeout(() => {
      const id = uuidv4();
      documents.push({
        id,
        name: file.name,
        content: `Sample content for ${file.name}`,
      });
      resolve(id);
    }, 1000);
  });
};

// Function to process a question and generate a response
export const processQuestion = async (question: string): Promise<Message> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses: ResponseType[] = [];
      
      // Generate text response
      responses.push({
        type: "text",
        content: generateTextResponse(question),
      });
      
      // Generate PlantUML diagram if needed
      if (shouldGenerateDiagram(question)) {
        responses.push({
          type: "plantuml",
          content: generatePlantUMLDiagram(question),
          title: `Diagram: ${question.substring(0, 30)}...`,
        });
      }
      
      resolve({
        id: uuidv4(),
        role: "assistant",
        content: responses,
        timestamp: new Date(),
      });
    }, 2000);
  });
};

// Helper function to determine if a diagram should be generated
const shouldGenerateDiagram = (question: string): boolean => {
  const diagramKeywords = [
    'diagram',
    'flow',
    'sequence',
    'architecture',
    'process',
    'workflow',
    'structure',
    'relationship',
    'how does',
    'how do',
    'explain the flow',
    'show me',
    'visualize',
    'class diagram',
    'component diagram',
  ];
  
  return diagramKeywords.some(keyword => 
    question.toLowerCase().includes(keyword.toLowerCase())
  );
};

// Helper function to generate PlantUML diagrams based on the question
const generatePlantUMLDiagram = (question: string): string => {
  // This is a simple example. In a real application, you would:
  // 1. Parse the question to understand what type of diagram is needed
  // 2. Generate appropriate PlantUML code based on the context
  // 3. Possibly use AI to generate more accurate diagrams
  
  if (question.toLowerCase().includes('sequence')) {
    return `@startuml
participant User
participant System
participant Database

User -> System: Request Data
System -> Database: Query Data
Database --> System: Return Results
System --> User: Display Results
@enduml`;
  }
  
  if (question.toLowerCase().includes('class')) {
    return `@startuml
class User {
  +id: string
  +name: string
  +email: string
  +login()
  +logout()
}

class Document {
  +id: string
  +title: string
  +content: string
  +upload()
  +delete()
}

User "1" -- "*" Document: owns
@enduml`;
  }
  
  // Default to a simple process diagram
  return `@startuml
start
:User Action;
if (Valid Input?) then (yes)
  :Process Data;
  :Save Results;
else (no)
  :Show Error;
endif
:Display Response;
stop
@enduml`;
};

// Helper function to generate text response
const generateTextResponse = (question: string): string => {
  try {
    // Make synchronous API call using XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:7158/query', false); 
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      query: question,
      top_k: 2
    }));

    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      return response.ai_response;
    } else {
      console.error('Error fetching AI response:', xhr.statusText);
      return "I apologize, but I'm having trouble generating a response right now. Please try again later.";
    }
  } catch (error) {
    console.error('Error fetching AI response:', error);
    return "I apologize, but I'm having trouble generating a response right now. Please try again later.";
  }
};

// Helper function to determine if code should be generated
const shouldGenerateCode = (question: string): boolean => {
  const codeKeywords = ["code", "example", "snippet", "how to", "implement", "function", "class", "method"];
  return codeKeywords.some(keyword => question.toLowerCase().includes(keyword));
};

// Helper function to determine the programming language for the code snippet
const determineLanguage = (question: string): string => {
  if (question.toLowerCase().includes("javascript") || question.toLowerCase().includes("js")) {
    return "javascript";
  } else if (question.toLowerCase().includes("typescript") || question.toLowerCase().includes("ts")) {
    return "typescript";
  } else if (question.toLowerCase().includes("python") || question.toLowerCase().includes("py")) {
    return "python";
  } else if (question.toLowerCase().includes("java")) {
    return "java";
  } else if (question.toLowerCase().includes("c#") || question.toLowerCase().includes("csharp")) {
    return "csharp";
  } else {
    return "javascript"; // Default
  }
};

// Helper function to generate code snippets
const generateCodeSnippet = (question: string): string => {
  const language = determineLanguage(question);
  
  const snippets: Record<string, string> = {
    javascript: `// Authentication example
async function login(username, password) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    
    const { token } = await response.json();
    localStorage.setItem('authToken', token);
    
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}`,
    typescript: `// Authentication example with TypeScript
interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  }
}

async function login(username: string, password: string): Promise<boolean> {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    
    const data: LoginResponse = await response.json();
    localStorage.setItem('authToken', data.token);
    
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}`,
    python: `# Authentication example in Python
import requests
import json

def login(username, password):
    try:
        response = requests.post(
            'https://api.example.com/login',
            headers={'Content-Type': 'application/json'},
            data=json.dumps({'username': username, 'password': password})
        )
        
        response.raise_for_status()
        data = response.json()
        
        # Store token in session or cookie
        return data['token']
    except requests.exceptions.RequestException as e:
        print(f"Login error: {e}")
        return None`,
    java: `// Authentication example in Java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.json.JSONObject;

public class AuthService {
    private static final String API_URL = "https://api.example.com/login";
    
    public String login(String username, String password) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            
            JSONObject requestBody = new JSONObject();
            requestBody.put("username", username);
            requestBody.put("password", password);
            
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                .build();
                
            HttpResponse<String> response = client.send(
                request, HttpResponse.BodyHandlers.ofString());
                
            if (response.statusCode() == 200) {
                JSONObject jsonResponse = new JSONObject(response.body());
                return jsonResponse.getString("token");
            } else {
                throw new RuntimeException("Authentication failed");
            }
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            return null;
        }
    }
}`,
    csharp: `// Authentication example in C#
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class AuthService
{
    private readonly HttpClient _httpClient;
    private const string ApiUrl = "https://api.example.com/login";
    
    public AuthService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }
    
    public async Task<string> LoginAsync(string username, string password)
    {
        try
        {
            var requestData = new
            {
                Username = username,
                Password = password
            };
            
            var json = JsonSerializer.Serialize(requestData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            var response = await _httpClient.PostAsync(ApiUrl, content);
            response.EnsureSuccessStatusCode();
            
            var responseJson = await response.Content.ReadAsStringAsync();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var result = JsonSerializer.Deserialize<LoginResponse>(responseJson, options);
            
            return result.Token;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Login error: {ex.Message}");
            return null;
        }
    }
    
    private class LoginResponse
    {
        public string Token { get; set; }
    }
}`
  };
  
  return snippets[language] || snippets.javascript;
};

// Service to handle document management
export const getDocuments = async () => {
  // In a real application, you would fetch documents from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        documents.map((doc) => ({
          id: doc.id,
          name: doc.name,
          size: Math.floor(Math.random() * 1024 * 1024 * 5), // Random size for demonstration
          uploadedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date within the last 30 days
        }))
      );
    }, 500);
  });
};
