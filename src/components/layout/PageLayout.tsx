
import { cn } from "@/lib/utils";
import Header from "./Header";
import Footer from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
  noPadding?: boolean;
}

const PageLayout = ({ 
  children, 
  className,
  fullHeight = false,
  noPadding = false
}: PageLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main 
        className={cn(
          "flex-1 w-full",
          !noPadding && "container py-8",
          fullHeight && "flex flex-col",
          className
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
