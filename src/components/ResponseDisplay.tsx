import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import CodeBlock from "./CodeBlock";
import DiagramDisplay from "./DiagramDisplay";
import PlantUMLRenderer from "./PlantUMLRenderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, User, Code, FileCode, PanelLeftClose, PanelLeftOpen, TextCursorInput } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';

export type ResponseType = 
  | { type: "text"; content: string }
  | { type: "code"; content: string; language: string }
  | { type: "diagram"; content: string; title?: string }
  | { type: "plantuml"; content: string; title?: string };

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: ResponseType[];
  timestamp: Date;
}

interface ResponseDisplayProps {
  messages: Message[];
  className?: string;
}

const ResponseDisplay = ({ messages, className }: ResponseDisplayProps) => {
  const [activeTab, setActiveTab] = useState<"chat" | "code" | "diagrams">("chat");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const codeSnippets = messages.flatMap(message => 
    message.content.filter((item): item is { type: "code"; content: string; language: string } => 
      item.type === "code"
    )
  );
  
  const diagrams = messages.flatMap(message => 
    message.content.filter((item): item is { type: "diagram" | "plantuml"; content: string; title?: string } => 
      item.type === "diagram" || item.type === "plantuml"
    )
  );

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={cn("flex h-full overflow-hidden border rounded-lg", className)}>
      <div 
        className={cn(
          "border-r transition-all duration-300 ease-in-out overflow-hidden",
          sidebarOpen ? "w-64" : "w-0"
        )}
      >
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <div className="flex items-center justify-between p-3 border-b">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="chat" className="flex items-center gap-1 text-xs">
                <TextCursorInput className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-1 text-xs">
                <Code className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Code</span>
              </TabsTrigger>
              <TabsTrigger value="diagrams" className="flex items-center gap-1 text-xs">
                <FileCode className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Diagrams</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="overflow-y-auto h-[calc(100%-47px)]">
            <TabsContent value="chat" className="m-0 p-0">
              <div className="px-3 py-2">
                <h4 className="text-sm font-medium">Chat History</h4>
              </div>
              <ul className="px-1">
                {messages.map(message => (
                  <li 
                    key={message.id}
                    className="px-2 py-1.5 text-sm truncate rounded hover:bg-muted/50 cursor-pointer"
                  >
                    {message.role === "user" ? (
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate">
                          {message.content[0]?.type === "text" 
                            ? message.content[0].content.substring(0, 30) 
                            : "User message"}
                          {message.content[0]?.type === "text" && message.content[0].content.length > 30 
                            ? "..." 
                            : ""}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Bot className="h-3 w-3 text-primary" />
                        <span className="text-muted-foreground truncate">
                          {message.content.length} response{message.content.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="code" className="m-0 p-0">
              <div className="px-3 py-2">
                <h4 className="text-sm font-medium">Code Snippets</h4>
              </div>
              <ul className="px-1">
                {codeSnippets.length === 0 ? (
                  <li className="p-3 text-sm text-center text-muted-foreground">
                    No code snippets available
                  </li>
                ) : (
                  codeSnippets.map((snippet, index) => (
                    <li 
                      key={index}
                      className="px-2 py-1.5 text-sm rounded hover:bg-muted/50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Code className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">
                          {snippet.language} snippet {index + 1}
                        </span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </TabsContent>
            
            <TabsContent value="diagrams" className="m-0 p-0">
              <div className="px-3 py-2">
                <h4 className="text-sm font-medium">Diagrams</h4>
              </div>
              <ul className="px-1">
                {diagrams.length === 0 ? (
                  <li className="p-3 text-sm text-center text-muted-foreground">
                    No diagrams available
                  </li>
                ) : (
                  diagrams.map((diagram, index) => (
                    <li 
                      key={index}
                      className="px-2 py-1.5 text-sm rounded hover:bg-muted/50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <FileCode className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">
                          {diagram.title || `Diagram ${index + 1}`}
                        </span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center p-3 border-b">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="mr-2 h-8 w-8"
          >
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </Button>
          <h2 className="text-sm font-medium">MynMentor</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={cn(
                "flex gap-3 animate-fade-in",
                message.role === "assistant" && "items-start",
                message.role === "user" && "items-start justify-end",
              )}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              
              <div 
                className={cn(
                  "rounded-lg",
                  message.role === "assistant" 
                    ? "bg-muted/30 border shadow-sm max-w-3xl" 
                    : "bg-primary/10 max-w-xl"
                )}
              >
                {message.content.map((item, index) => (
                  <div 
                    key={index}
                    className={cn(
                      index !== 0 && "border-t",
                      "p-3"
                    )}
                  >
                    {item.type === "text" && (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            h3: ({node, ...props}) => (
                              <h3 className="text-xl font-bold my-4" {...props} />
                            ),
                            strong: ({node, ...props}) => (
                              <strong className="font-semibold text-gray-900" {...props} />
                            ),
                            ul: ({node, ...props}) => (
                              <ul className="list-disc pl-6 my-2" {...props} />
                            ),
                            li: ({node, ...props}) => (
                              <li className="my-1" {...props} />
                            ),
                            code: ({node, ...props}) => (
                              <code className="bg-gray-100 rounded px-1 py-0.5" {...props} />
                            ),
                          }}
                        >
                          {item.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    
                    {item.type === "code" && (
                      <CodeBlock
                        code={item.content}
                        language={item.language}
                      />
                    )}
                    
                    {item.type === "diagram" && (
                      <DiagramDisplay
                        diagramSvg={item.content}
                        title={item.title}
                      />
                    )}

                    {item.type === "plantuml" && (
                      <PlantUMLRenderer
                        content={item.content}
                        title={item.title}
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResponseDisplay;
