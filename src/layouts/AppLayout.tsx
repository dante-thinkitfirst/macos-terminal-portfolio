import { useEffect, useState } from "react";
import MacToolbar from "../components/global/MacToolbar";
import MacTerminal from "../components/global/MacTerminal";
import MobileDock from "../components/global/MobileDock";
import DesktopDock from "../components/global/DesktopDock";
import Projects from "../components/Projects";

interface AppLayoutProps {
  initialBg: string;
  backgroundMap: Record<string, string>;
}

export default function Desktop({ initialBg, backgroundMap }: AppLayoutProps) {
  const [currentBg, setCurrentBg] = useState<string>(initialBg);
  const [showProjects, setShowProjects] = useState(false);

  useEffect(() => {
    const lastBg = localStorage.getItem("lastBackground");

    if (lastBg === initialBg) {
      const bgKeys = Object.keys(backgroundMap);
      const availableBgs = bgKeys.filter((bg) => bg !== lastBg);
      const newBg =
        availableBgs[Math.floor(Math.random() * availableBgs.length)];
      setCurrentBg(newBg);
    }

    localStorage.setItem("lastBackground", currentBg);
  }, [initialBg, backgroundMap]);

  const toggleProjects = () => {
    setShowProjects(!showProjects);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundMap[currentBg]})` }}
      />

      <div className="relative z-10">
        <MacToolbar onToggleProjects={toggleProjects} />
      </div>

      <div className="relative z-0 flex items-center justify-center h-[calc(100vh-10rem)] md:h-[calc(100vh-1.5rem)] pt-6">
        <MacTerminal />
      </div>

      {/* Projects Finder Window */}
      {showProjects && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[64%] pointer-events-none">
          <div className="pointer-events-auto">
            <Projects onClose={toggleProjects} />
          </div>
        </div>
      )}

      <MobileDock onToggleProjects={toggleProjects} />
      <DesktopDock onToggleProjects={toggleProjects} />
    </div>
  );
}
