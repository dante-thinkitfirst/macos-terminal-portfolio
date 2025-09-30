import { useState, useRef, useEffect } from "react";
import ProjectModal from "./ProjectModal";

// Example projects data
const projectsData = [
  {
    id: 1,
    title: "Shopify Theme",
    image: "/images/icons/shopify-icon.svg",
    description:
      "This is a custom Shopify theme built on top of the Debut theme, designed for streetwear and fashion brands. Inspired by Kith and Supreme, it combines bold design elements, advanced animations with GSAP and ScrollTrigger, and a fully customizable structure to deliver an immersive shopping experience. The theme emphasizes responsive design, SEO optimization, and modern ecommerce functionality, making it both visually striking and practical for real-world brands.",
    techStack: [
      "Shopify",
      "Liquid",
      "HTML",
      "CSS",
      "JavaScript",
      "GSAP",
      "ScrollTrigger",
      "Responsive Design",
      "SEO Optimization",
      "Custom Theme Development",
    ],
    liveUrl: "https://dystopian-attire.myshopify.com/",
    githubUrl: "https://github.com/dante-thinkitfirst/dystopian-theme",
    icon: "/images/icons/shopify-icon.svg",
    password: "dystopian",
  },

  {
    id: 2,
    title: "Full-Stack Portfolio Website",
    image: "/images/icons/react-icon.svg",
    description:
      "Friendly Dev is a full-stack portfolio example website that demonstrates how modern portfolios can be built with a custom frontend and backend. The frontend leverages React, Vite, TanStack Router, and TailwindCSS for a responsive UI, while the backend uses Strapi, Node.js, TypeScript, and Postgres to power authentication, content modeling, and scalable APIs. This project highlights full-stack development skills and serves as a reusable template for other developers looking to showcase their own work.",
    techStack: [
      "React",
      "TanStack Router",
      "TailwindCSS",
      "Axios",
      "Strapi",
      "Node.js",
      "TypeScript",
      "Postgres",
      "API Integration",
      "Full-Stack Development",
    ],
    liveUrl: "https://friendly-dev-frontend-azure.vercel.app/",
    githubUrl: "https://github.com/dante-thinkitfirst/friendly-dev-frontend",
    icon: "/images/icons/react-icon.svg",
  },
  {
    id: 3,
    title: "Idea Drop – MERN Stack Application",
    image: "/images/icons/react-icon.svg",
    description:
      "Idea Drop is a full-stack MERN application for sharing, browsing, and managing creative ideas. The frontend is built with React, Vite, TanStack Router, and TailwindCSS, providing a responsive UI and smooth client-side routing. The backend uses Node.js, Express, and MongoDB with JWT authentication to handle API endpoints, idea management, and secure data storage. This project demonstrates full-stack development with the MERN stack, covering frontend architecture, backend API design, authentication, and database integration.",
    techStack: [
      "React",
      "Vite",
      "TanStack Router",
      "TailwindCSS",
      "Axios",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT Authentication",
      "API Integration",
      "MERN Stack",
      "Full-Stack Development",
      "Responsive UI/UX",
    ],
    liveUrl: "https://idea-drop-ui-sigma.vercel.app/",
    githubUrl: "https://github.com/dante-thinkitfirst/idea-drop-ui",
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
  {
    id: 5,
    title: "Crypto Dashboard",
    image: "/images/icons/react-icon.svg",
    description:
      "Crypto Dashboard is a responsive frontend web application that tracks live cryptocurrency market data using the CoinGecko API. Built with React, Vite, and TailwindCSS, it features real-time price updates, interactive charts powered by Chart.js, and a clean, modern UI. This project highlights skills in frontend development, API integration, data visualization, and deployment workflows using Vercel.",
    techStack: [
      "React",
      "Vite",
      "TailwindCSS",
      "Chart.js",
      "Recharts",
      "CoinGecko API",
      "API Integration",
    ],
    liveUrl: "https://crypto-dashboard-omega-seven.vercel.app/",
    githubUrl: "https://github.com/dante-thinkitfirst/crypto-dashboard",
    icon: "/images/icons/react-icon.svg",
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
