import { useState, useRef, useEffect } from "react";
import ProjectModal from "./ProjectModal";

// Example projects data
const projectsData = [
  {
    id: 1,
    title: "Portfolio Website",
    image: "/images/icons/placeholder-icon.svg",
    description:
      "A personal portfolio website built with modern web technologies to showcase my projects and skills.",
    techStack: ["Astro", "React", "TailwindCSS", "TypeScript"],
    liveUrl: "https://example.com/portfolio",
    githubUrl: "https://github.com/username/portfolio",
    icon: "/images/icons/placeholder-icon.svg",
  },
  {
    id: 2,
    title: "E-commerce Platform",
    image: "/images/icons/placeholder-icon.svg",
    description:
      "A full-featured e-commerce platform with shopping cart, user authentication, and payment processing.",
    techStack: ["Next.js", "Node.js", "MongoDB", "Stripe"],
    liveUrl: "https://example.com/ecommerce",
    githubUrl: "https://github.com/username/ecommerce",
    icon: "/images/icons/placeholder-icon.svg",
  },
  {
    id: 3,
    title: "Weather App",
    image: "/images/icons/placeholder-icon.svg",
    description:
      "A weather application that provides real-time weather information based on user location or search.",
    techStack: ["React", "OpenWeather API", "TailwindCSS"],
    liveUrl: "https://example.com/weather",
    githubUrl: "https://github.com/username/weather-app",
    icon: "/images/icons/placeholder-icon.svg",
  },
  {
    id: 4,
    title: "Task Manager",
    image: "/images/icons/placeholder-icon.svg",
    description:
      "A productivity application for managing tasks, projects, and deadlines with a clean and intuitive UI.",
    techStack: ["Vue.js", "Firebase", "Vuetify"],
    liveUrl: "https://example.com/taskmanager",
    githubUrl: "https://github.com/username/task-manager",
    icon: "/images/icons/placeholder-icon.svg",
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
      className="w-full max-w-5xl shadow-2xl transform will-change-transform select-none"
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
          <div className="flex space-x-2">
            {onClose ? (
              <button
                onClick={onClose}
                className="w-3 h-3 bg-red-500 hover:bg-red-600 transition-colors rounded-full"
              />
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
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {projectsData.map((project) => (
            <button
              key={project.id}
              onClick={() => openProjectModal(project)}
              className="flex flex-col items-center group focus:outline-none"
            >
              <div className="w-16 h-16 mb-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                {project.icon ? (
                  <img
                    src={project.icon}
                    alt={project.title}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">
                    {project.title.charAt(0)}
                  </div>
                )}
              </div>
              <span className="text-sm text-center text-gray-700 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
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
