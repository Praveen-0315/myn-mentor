
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
  // In a real application, you would send the question to a backend service
  // This is just a simulation
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses: ResponseType[] = [];
      
      // Generate text response
      responses.push({
        type: "text",
        content: generateTextResponse(question),
      });
      
      // Generate code response if needed
      // if (shouldGenerateCode(question)) {
      //   responses.push({
      //     type: "code",
      //     content: generateCodeSnippet(question),
      //     language: determineLanguage(question),
      //   });
      // }
      
      // // Generate diagram if needed
      // if (shouldGenerateDiagram(question)) {
      //   responses.push({
      //     type: "diagram",
      //     content: generateDiagram(question),
      //     title: `Diagram for ${question.substring(0, 20)}...`,
      //   });
      // }
      
      resolve({
        id: uuidv4(),
        role: "assistant",
        content: responses,
        timestamp: new Date(),
      });
    }, 2000);
  });
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

// Helper function to determine if a diagram should be generated
const shouldGenerateDiagram = (question: string): boolean => {
  const diagramKeywords = ["diagram", "flow", "architecture", "system", "process", "structure", "relationship"];
  return diagramKeywords.some(keyword => question.toLowerCase().includes(keyword));
};

// Helper function to generate a diagram
const generateDiagram = (question: string): string => {
  // In a real application, this would generate a proper diagram
  // For this example, we'll return a simple SVG
  
  if (question.toLowerCase().includes("authentication") || question.toLowerCase().includes("login")) {
    return `<svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
      <style>
        .title { font: bold 16px sans-serif; }
        .label { font: 12px sans-serif; }
        .box { fill: white; stroke: #3b82f6; stroke-width: 2; }
        .arrow { fill: none; stroke: #64748b; stroke-width: 2; }
      </style>
      
      <!-- Title -->
      <text x="250" y="30" text-anchor="middle" class="title">Authentication Flow</text>
      
      <!-- Boxes -->
      <rect x="50" y="70" width="100" height="60" rx="5" class="box" />
      <text x="100" y="100" text-anchor="middle" class="label">Client</text>
      
      <rect x="200" y="70" width="100" height="60" rx="5" class="box" />
      <text x="250" y="100" text-anchor="middle" class="label">Auth API</text>
      
      <rect x="350" y="70" width="100" height="60" rx="5" class="box" />
      <text x="400" y="100" text-anchor="middle" class="label">Database</text>
      
      <rect x="200" y="200" width="100" height="60" rx="5" class="box" />
      <text x="250" y="230" text-anchor="middle" class="label">JWT Service</text>
      
      <!-- Arrows -->
      <path d="M150,90 H200" class="arrow" marker-end="url(#arrowhead)" />
      <text x="175" y="85" text-anchor="middle" class="label" style="font-size: 10px">1. Login</text>
      
      <path d="M300,90 H350" class="arrow" marker-end="url(#arrowhead)" />
      <text x="325" y="85" text-anchor="middle" class="label" style="font-size: 10px">2. Verify</text>
      
      <path d="M250,130 V200" class="arrow" marker-end="url(#arrowhead)" />
      <text x="265" y="165" text-anchor="middle" class="label" style="font-size: 10px">3. Generate Token</text>
      
      <path d="M200,220 H100 V130" class="arrow" marker-end="url(#arrowhead)" />
      <text x="125" y="180" text-anchor="middle" class="label" style="font-size: 10px">4. Return JWT</text>
      
      <!-- Arrow Marker -->
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
        </marker>
      </defs>
    </svg>`;
  } else if (question.toLowerCase().includes("architecture") || question.toLowerCase().includes("system")) {
    return `<svg width="500" height="350" xmlns="http://www.w3.org/2000/svg">
      <style>
        .title { font: bold 16px sans-serif; }
        .label { font: 12px sans-serif; }
        .box { fill: white; stroke: #3b82f6; stroke-width: 2; }
        .service { fill: #dbeafe; stroke: #3b82f6; stroke-width: 2; }
        .database { fill: #eff6ff; stroke: #3b82f6; stroke-width: 2; }
        .arrow { fill: none; stroke: #64748b; stroke-width: 2; }
      </style>
      
      <!-- Title -->
      <text x="250" y="30" text-anchor="middle" class="title">Microservices Architecture</text>
      
      <!-- API Gateway -->
      <rect x="175" y="50" width="150" height="40" rx="5" class="box" />
      <text x="250" y="75" text-anchor="middle" class="label">API Gateway</text>
      
      <!-- Services -->
      <rect x="50" y="150" width="100" height="60" rx="5" class="service" />
      <text x="100" y="180" text-anchor="middle" class="label">User Service</text>
      
      <rect x="175" y="150" width="100" height="60" rx="5" class="service" />
      <text x="225" y="180" text-anchor="middle" class="label">Content Service</text>
      
      <rect x="300" y="150" width="100" height="60" rx="5" class="service" />
      <text x="350" y="180" text-anchor="middle" class="label">Analytics Service</text>
      
      <!-- Databases -->
      <rect x="50" y="250" width="100" height="40" rx="5" class="database" />
      <text x="100" y="275" text-anchor="middle" class="label">User DB</text>
      
      <rect x="175" y="250" width="100" height="40" rx="5" class="database" />
      <text x="225" y="275" text-anchor="middle" class="label">Content DB</text>
      
      <rect x="300" y="250" width="100" height="40" rx="5" class="database" />
      <text x="350" y="275" text-anchor="middle" class="label">Analytics DB</text>
      
      <!-- Arrows -->
      <path d="M250,90 V120 H100 V150" class="arrow" marker-end="url(#arrowhead)" />
      <path d="M250,90 V150" class="arrow" marker-end="url(#arrowhead)" />
      <path d="M250,90 V120 H350 V150" class="arrow" marker-end="url(#arrowhead)" />
      
      <path d="M100,210 V250" class="arrow" marker-end="url(#arrowhead)" />
      <path d="M225,210 V250" class="arrow" marker-end="url(#arrowhead)" />
      <path d="M350,210 V250" class="arrow" marker-end="url(#arrowhead)" />
      
      <path d="M150,180 H175" class="arrow" marker-end="url(#arrowhead)" />
      <path d="M275,180 H300" class="arrow" marker-end="url(#arrowhead)" />
      
      <!-- Arrow Marker -->
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
        </marker>
      </defs>
    </svg>`;
  } else {
    return `<svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
      <style>
        .title { font: bold 16px sans-serif; }
        .label { font: 12px sans-serif; }
        .box { fill: white; stroke: #3b82f6; stroke-width: 2; }
        .arrow { fill: none; stroke: #64748b; stroke-width: 2; }
      </style>
      
      <!-- Title -->
      <text x="250" y="30" text-anchor="middle" class="title">System Process Flow</text>
      
      <!-- Boxes -->
      <rect x="50" y="70" width="100" height="60" rx="5" class="box" />
      <text x="100" y="100" text-anchor="middle" class="label">Input</text>
      
      <rect x="200" y="70" width="100" height="60" rx="5" class="box" />
      <text x="250" y="100" text-anchor="middle" class="label">Processing</text>
      
      <rect x="350" y="70" width="100" height="60" rx="5" class="box" />
      <text x="400" y="100" text-anchor="middle" class="label">Output</text>
      
      <rect x="125" y="180" width="100" height="60" rx="5" class="box" />
      <text x="175" y="210" text-anchor="middle" class="label">Validation</text>
      
      <rect x="275" y="180" width="100" height="60" rx="5" class="box" />
      <text x="325" y="210" text-anchor="middle" class="label">Storage</text>
      
      <!-- Arrows -->
      <path d="M150,100 H200" class="arrow" marker-end="url(#arrowhead)" />
      <path d="M300,100 H350" class="arrow" marker-end="url(#arrowhead)" />
      <path d="M100,130 V210 H125" class="arrow" marker-end="url(#arrowhead)" />
      <path d="M225,210 H275" class="arrow" marker-end="url(#arrowhead)" />
      <path d="M325,180 V130 H300" class="arrow" marker-end="url(#arrowhead)" />
      
      <!-- Arrow Marker -->
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
        </marker>
      </defs>
    </svg>`;
  }
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
