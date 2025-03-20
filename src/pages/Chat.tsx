
import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/PageLayout";
import ResponseDisplay, { Message } from "@/components/ResponseDisplay";
import QuestionInput from "@/components/QuestionInput";
import { processQuestion } from "@/utils/aiService";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Add a welcome message when the chat loads
    setMessages([
      {
        id: uuidv4(),
        role: "assistant",
        content: [
          {
            type: "text",
            content: "Hello! I'm your AI Mentor. I've been trained on your team's documentation and can help answer questions, explain concepts, generate diagrams, and provide code examples. How can I help you today?"
          }
        ],
        timestamp: new Date()
      }
    ]);
  }, []);

  const handleSendQuestion = async (question: string) => {
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: [{ type: "text", content: question }],
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    try {
      // Process the question and get AI response
      const aiResponse = await processQuestion(question);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem processing your question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageLayout noPadding fullHeight>
      <div className="container h-full py-6 flex flex-col">
        <div className="flex-1 min-h-0">
          <ResponseDisplay 
            messages={messages} 
            className="h-full animate-fade-in" 
          />
        </div>
        
        <div className="mt-4 animate-fade-in">
          <QuestionInput 
            onSendQuestion={handleSendQuestion} 
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Chat;
