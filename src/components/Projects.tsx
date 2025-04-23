import { useState, useRef, useEffect } from "react";
import ProjectModal from "./ProjectModal";

// Example projects data
const projectsData = [
  {
    id: 1,
    title: "Shopify Theme",
    image: "/images/icons/shopify-icon.svg",
    description:
      "A fully customizable Shopify theme built on top of Debut, designed for streetwear brands. Features GSAP-powered animations, scroll-triggered effects, and a bold, mobile-first aesthetic inspired by Kith and Supreme.<br><br>Store Password: dystopian",
    techStack: [
      "Shopify",
      "Liquid",
      "GSAP",
      "ScrollTrigger",
      "JavaScript",
      "HTML",
      "CSS",
    ],
    liveUrl: "https://dystopian-attire.myshopify.com",
    githubUrl:
      "https://github.com/dante-thinkitfirst/dystopian-shopify-theme?tab=readme-ov-file",
    icon: "/images/icons/shopify-icon.svg",
  },
  {
    id: 2,
    title: "WordPress Attorney Website",
    image: "/images/icons/wordpress-icon.svg",
    description:
      "A professional website built for attorney Paul J. Susko, showcasing his legal services, experience, and credentials. Designed with clean layouts and optimized for accessibility, the site serves as a digital brochure for prospective clients and includes direct contact options.",
    techStack: ["WordPress", "PHP", "ACF", "JavaScript", "HTML", "CSS"],
    liveUrl: "https://ksslawfirm.com",
    icon: "/images/icons/wordpress-icon.svg",
  },
  {
    id: 3,
    title: "React Landing Page for Digital Agency",
    image: "/images/icons/react-icon.svg",
    description:
      "A minimal, high-impact landing page for CODESTORIES — a digital agency that helps brands turn broken sites into high-converting experiences. Features smooth animations, performance-optimized deployment, and a conversion-focused layout built with modern frontend tools.",
    techStack: [
      "React",
      "FramerMotion",
      "JavaScript",
      "Vercel",
      "GoogleAnalytics",
      "HTML",
      "CSS",
    ],
    liveUrl: "https://thecodestories.io",
    icon: "/images/icons/react-icon.svg",
  },
  {
    id: 4,
    title: "Astro Marketplace Website",
    image: "/images/icons/astro-icon.svg",
    description:
      "An in-progress Astro-powered landing site for Jeep Flea Market — a digital platform for rare Jeep parts, off-road gear, and enthusiast community events. Combines content-rich pages, a service directory, and community-driven features in a blazing-fast static experience.",
    techStack: ["Astro", "JavaScript", "Vercel", "GoogleFonts", "HTML", "CSS"],
    liveUrl: "https://jeepflea.vercel.app",
    icon: "/images/icons/astro-icon.svg",
  },
];

interface ProjectsProps {
  onClose?: () => void;
}

export default function Projects({ onClose }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<
    (typeof projectsData)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const [startWindowPos, setStartWindowPos] = useState({ x: 0, y: 0 });
  const projectsRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - startDragPos.x;
        const deltaY = e.clientY - startDragPos.y;

        setPosition({
          x: startWindowPos.x + deltaX,
          y: startWindowPos.y + deltaY,
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - startDragPos.x;
        const deltaY = touch.clientY - startDragPos.y;

        setPosition({
          x: startWindowPos.x + deltaX,
          y: startWindowPos.y + deltaY,
        });

        e.preventDefault(); // Prevent scrolling while dragging
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.classList.remove("cursor-grabbing");
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
      document.addEventListener("touchcancel", handleTouchEnd);
      document.body.classList.add("cursor-grabbing");
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
      document.body.classList.remove("cursor-grabbing");
    };
  }, [isDragging, startDragPos, startWindowPos]);

  const openProjectModal = (project: (typeof projectsData)[0]) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300); // Delay to allow animation to complete
  };

  const handleToolbarMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't initiate drag if clicking on a button
    if ((e.target as HTMLElement).tagName === "BUTTON") {
      return;
    }

    // Store the starting drag position and window position
    setStartDragPos({ x: e.clientX, y: e.clientY });
    setStartWindowPos({ x: position.x, y: position.y });
    setIsDragging(true);

    e.preventDefault();
  };

  const handleToolbarTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Don't initiate drag if touching a button
    if ((e.target as HTMLElement).tagName === "BUTTON") {
      return;
    }

    if (e.touches.length > 0) {
      const touch = e.touches[0];

      // Store the starting drag position and window position
      setStartDragPos({ x: touch.clientX, y: touch.clientY });
      setStartWindowPos({ x: position.x, y: position.y });
      setIsDragging(true);
    }
  };

  return (
    <div
      ref={projectsRef}
      className="w-full shadow-2xl transform will-change-transform select-none"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        WebkitTransform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        backfaceVisibility: "hidden",
        transition: isDragging ? "none" : "transform 0.2s ease-out",
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Finder-style toolbar */}
        <div
          ref={toolbarRef}
          className="bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center cursor-grab active:cursor-grabbing touch-none"
          onMouseDown={handleToolbarMouseDown}
          onTouchStart={handleToolbarTouchStart}
        >
          <div className="flex space-x-2 group">
            {onClose ? (
              <button
                onClick={onClose}
                className="w-3 h-3 bg-red-500 hover:bg-red-600 transition-colors rounded-full relative"
              >
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[8px] text-gray-700 font-bold select-none transition-opacity">
                  ✕
                </span>
              </button>
            ) : (
              <div className="w-3 h-3 bg-red-500 rounded-full" />
            )}
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300 select-none">
              Projects
            </h2>
          </div>
          <div className="w-12"></div>
        </div>

        {/* Projects grid */}
        <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {projectsData.map((project) => (
            <button
              key={project.id}
              onClick={() => openProjectModal(project)}
              className="flex flex-col items-center group focus:outline-none"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 mb-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                {project.icon ? (
                  <img
                    src={project.icon}
                    alt={project.title}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">
                    {project.title.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-xs sm:text-sm text-center text-gray-700 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                {project.title.length > 15
                  ? `${project.title.slice(0, 12)}...`
                  : project.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={closeProjectModal}
          project={selectedProject}
        />
      )}
    </div>
  );
}
