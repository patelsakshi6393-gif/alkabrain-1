import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Brain, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-xl font-semibold mb-2">Page not found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/">
          <Button className="gap-2"><Home className="w-4 h-4" /> Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
