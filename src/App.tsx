import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Home } from "@/pages/Home";
import { Visualizer } from "@/pages/Visualizer";
import { Problems } from "@/pages/Problems";
import { Patterns } from "@/pages/Patterns";
import { Roadmap } from "@/pages/Roadmap";
import { Progress } from "@/pages/Progress";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visualizer/:problemId" element={<Visualizer />} />
          <Route path="/visualizer" element={<Visualizer />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
