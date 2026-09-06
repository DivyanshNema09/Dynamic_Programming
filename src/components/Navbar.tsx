import { Link, useLocation } from "react-router-dom";
import { Brain, Home, ListChecks, Grid3x3, Map, Trophy, Code2 } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/problems", label: "Problems", icon: ListChecks },
  { to: "/patterns", label: "Patterns", icon: Grid3x3 },
  { to: "/roadmap", label: "Roadmap", icon: Map },
  { to: "/progress", label: "Progress", icon: Trophy },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-bg-card/80 backdrop-blur-md border-b border-bg-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white text-sm hidden sm:block">DP Visualizer</span>
          </Link>

          <div className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    active ? "bg-primary-600/15 text-primary-400" : "text-gray-500 hover:text-gray-300 hover:bg-bg-hover"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <Link
            to="/visualizer/fibonacci"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-600 hover:bg-primary-500 text-white transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            Visualize
          </Link>
        </div>
      </div>
    </nav>
  );
}
