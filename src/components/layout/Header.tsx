
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link 
      to={to} 
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors rounded-full",
        isActive(to) 
          ? "bg-primary/10 text-primary" 
          : "text-foreground/70 hover:text-foreground hover:bg-accent"
      )}
    >
      {label}
    </Link>
  );

  const MobileNav = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-auto">
          <Menu className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-screen p-4 mr-4">
        <div className="flex flex-col space-y-2">
          <NavLink to="/" label="Home" />
          <NavLink to="/chat" label="AI Assistant" />
          <NavLink to="/admin" label="Admin" />
        </div>
      </PopoverContent>
    </Popover>
  );
  
  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-lg bg-background/70 animate-fade-in">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
            <div className="w-4 h-4 rounded-sm bg-primary animate-pulse-soft" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Onboard AI</span>
        </div>
        
        {isMobile ? (
          <MobileNav />
        ) : (
          <nav className="mx-auto flex items-center space-x-1">
            <NavLink to="/" label="Home" />
            <NavLink to="/chat" label="AI Assistant" />
            <NavLink to="/admin" label="Admin" />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
