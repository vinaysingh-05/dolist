import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Moon, Heart } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-mint">
              <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">HITLIST</span>
          </div>
          <Link to="/login">
            <Button variant="ghost" className="rounded-xl">
              Sign In
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-6 flex flex-col items-center justify-center text-center py-20">
        <div className="max-w-2xl mx-auto animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-float">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Calm productivity for mindful builders
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your{" "}
            <span className="text-gradient">HITLIST</span>
            <br />
            Starts Gently.
          </h1>

          {/* Subtext */}
          <p className="text-xl text-muted-foreground mb-10 max-w-md mx-auto">
            One habit. One day. Real progress.
            <br />
            Build discipline without the pressure.
          </p>

          {/* CTA */}
          <Link to="/login">
            <Button
              size="lg"
              className="h-14 px-10 text-lg font-semibold rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 glow-mint animate-pulse-glow"
            >
              Start My HITLIST
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-4xl w-full animate-slide-up stagger-2">
          <div className="glass rounded-2xl p-6 text-left group hover:glow-mint transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Moon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Monthly Fresh Start
            </h3>
            <p className="text-sm text-muted-foreground">
              Every month is a clean slate. No guilt, just new opportunities.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 text-left group hover:glow-purple transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
              <Heart className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Emotional Support
            </h3>
            <p className="text-sm text-muted-foreground">
              Kind reminders, not harsh notifications. We're here for you.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 text-left group hover:glow-mint transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Track with Calm
            </h3>
            <p className="text-sm text-muted-foreground">
              Beautiful analytics that celebrate your progress peacefully.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          My space. My pace. My HITLIST.
        </p>
      </footer>
    </div>
  );
}
