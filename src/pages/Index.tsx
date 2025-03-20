import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, MessageCircleQuestion, FileCode, Code, LockKeyhole, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Document Upload & AI Training",
    description: "Upload PDF documentation to train the AI on your team's specific knowledge and processes.",
    icon: <Upload className="h-6 w-6" />,
  },
  {
    title: "Context-Aware Q&A",
    description: "Ask questions about systems, processes, or codebase and get accurate answers based on your documentation.",
    icon: <MessageCircleQuestion className="h-6 w-6" />,
  },
  {
    title: "Diagram Generation",
    description: "Automatically create visual diagrams to explain complex systems and workflows.",
    icon: <FileCode className="h-6 w-6" />,
  },
  {
    title: "Code Examples",
    description: "Generate code snippets and examples to help developers understand implementation details.",
    icon: <Code className="h-6 w-6" />,
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [hoverFeature, setHoverFeature] = useState<number | null>(null);

  return (
    <PageLayout noPadding>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_500px_at_50%_200px,#e0f2fe,transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        
        <div className="container px-4 pt-20 pb-16 md:pt-32 md:pb-24 max-w-5xl">
          <div className="relative">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center justify-center rounded-full border border-primary/20 bg-background px-3 py-1 text-sm font-medium text-primary">
                <Star className="mr-1 h-3.5 w-3.5 text-primary" />
                <span>Streamline team onboarding</span>
              </div>
            </div>
          </div>
          
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl leading-tight animate-fade-in pb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                AI-Powered Mentor
              </span>
              <br />
              Assistant for Teams
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground animate-fade-in opacity-0 [animation-delay:200ms]">
              Upload your documentation, train the AI, and get new team members up to speed faster than ever.
              Contextual answers, diagrams, and code examples — all tailored to your organization.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => navigate("/admin")}
                size="lg"
                className="group rounded-full px-6 h-12 min-w-[180px] bg-primary hover:bg-primary/90"
              >
                <span>Get Started</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                onClick={() => navigate("/chat")}
                variant="outline"
                size="lg"
                className="rounded-full px-6 h-12 min-w-[180px] border-primary/20 hover:bg-primary/5"
              >
                Try the Assistant
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container py-16 md:py-24 max-w-5xl">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium mb-4">
            Key Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Everything you need for efficient onboarding
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Our AI assistant combines document understanding, natural language processing, and code generation
            to create a seamless onboarding experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-6 rounded-2xl border bg-background transition-all duration-300 ease-in-out"
              onMouseEnter={() => setHoverFeature(index)}
              onMouseLeave={() => setHoverFeature(null)}
            >
              <div className={cn(
                "absolute inset-0 rounded-2xl transition-opacity duration-300",
                hoverFeature === index ? "opacity-100" : "opacity-0"
              )}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 blur-xl" />
              </div>
              
              <div className="relative flex flex-col h-full">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container py-16 md:py-24">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
          
          <div className="p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm px-3 py-1 text-sm font-medium border border-primary/20 mb-4">
              <LockKeyhole className="mr-1 h-3.5 w-3.5 text-primary" />
              <span>Secure & Private</span>
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
              Ready to transform your onboarding?
            </h2>
            
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Get started today and watch as new team members become productive faster than ever before.
              Your documentation becomes an interactive AI-powered knowledge base.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => navigate("/admin")}
                className="rounded-full px-6 h-12 min-w-[180px]"
              >
                Upload Documents
              </Button>
              
              <Button
                onClick={() => navigate("/chat")}
                variant="outline"
                className="rounded-full px-6 h-12 min-w-[180px]"
              >
                Ask the Assistant
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
