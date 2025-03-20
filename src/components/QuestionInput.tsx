
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionInputProps {
  onSendQuestion: (question: string) => void;
  isProcessing?: boolean;
  placeholder?: string;
  className?: string;
}

const QuestionInput = ({
  onSendQuestion,
  isProcessing = false,
  placeholder = "Ask a question about your documents...",
  className,
}: QuestionInputProps) => {
  const [question, setQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSend = () => {
    if (question.trim() && !isProcessing) {
      onSendQuestion(question.trim());
      setQuestion("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoiceInput = () => {
    // In a real application, you would implement speech-to-text functionality
    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setQuestion(prev => prev + " How does the authentication system work?");
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "flex items-end w-full rounded-lg border bg-background transition-all overflow-hidden",
        isProcessing ? "opacity-80" : "opacity-100",
        isListening && "ring-2 ring-primary"
      )}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : placeholder}
          disabled={isProcessing || isListening}
          className={cn(
            "flex-1 resize-none border-0 bg-transparent px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0",
            "min-h-[80px] max-h-[200px] placeholder:text-muted-foreground"
          )}
        />
        <div className="flex items-center p-3 gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={toggleVoiceInput}
            disabled={isProcessing}
            className={cn(
              "rounded-full h-9 w-9",
              isListening && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            disabled={!question.trim() || isProcessing}
            className="rounded-full gap-1"
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span className="sr-only sm:not-sr-only sm:inline-block">Send</span>
                <SendHorizontal className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {isListening && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="relative rounded-full bg-primary text-primary-foreground p-2">
              <Mic className="h-5 w-5" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionInput;
