import { useState, useEffect, useRef } from "react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    image: string;
    description: string;
    techStack: string[];
    liveUrl?: string;
    githubUrl?: string;
  };
}

export default function ProjectModal({
  isOpen,
  onClose,
  project,
}: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  const [startWindowPos, setStartWindowPos] = useState({ x: 0, y: 0 });

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        isOpen &&
        !isDragging // Prevent closing while dragging
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isDragging]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

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

  // Handle smooth closing animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200); // Match this duration with the CSS transition
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        ref={modalRef}
        className={`w-full mx-5 md:w-[90%] md:max-w-4xl bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl 
                   transform will-change-transform select-none ${
                     isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
                   }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          WebkitTransform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          backfaceVisibility: "hidden",
          transition: isDragging
            ? "none"
            : "transform 0.2s ease-out, opacity 0.2s ease-out, scale 0.2s ease-out",
        }}
      >
        {/* Window Controls */}
        <div
          ref={toolbarRef}
          className="flex items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 cursor-grab active:cursor-grabbing touch-none"
          onMouseDown={handleToolbarMouseDown}
          onTouchStart={handleToolbarTouchStart}
        >
          <div className="flex space-x-2 group">
            <button
              onClick={handleClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors relative"
              aria-label="Close window"
            >
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[8px] text-gray-700 font-bold select-none transition-opacity">
                ✕
              </span>
            </button>
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <div className="flex-1 text-center text-sm text-gray-600 dark:text-gray-300 font-medium select-none">
            {project.title}
          </div>
          <div className="w-16"></div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row">
          {/* Left side: Project image */}
          <div className="w-full md:w-1/2 h-64 md:h-auto flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <img
              src={project.image}
              alt={project.title}
              className="w-[85%] h-[85%] object-contain"
            />
          </div>

          {/* Right side: Project details */}
          <div className="w-full md:w-1/2 p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              {project.title}
            </h2>

            {/* Tech stack badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                >
                  {tech}
                </span>
              ))}
            </div>

            <p
              className="text-gray-600 dark:text-gray-300 mb-6 flex-grow"
              dangerouslySetInnerHTML={{ __html: project.description }}
            ></p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition-colors"
                >
                  Live Site
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg text-center transition-colors"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
