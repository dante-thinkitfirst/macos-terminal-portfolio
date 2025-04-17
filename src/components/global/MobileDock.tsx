import { BsGithub, BsSpotify } from "react-icons/bs";
import { IoIosMail, IoIosCall } from "react-icons/io";
import { IoFolderOpenOutline } from "react-icons/io5";

interface MobileDockProps {
  onToggleProjects: () => void;
}

export default function MobileDock({ onToggleProjects }: MobileDockProps) {
  const handleEmailClick = () => {
    window.location.href = "mailto:dantesilvacodes@gmail.com";
  };

  const handleGithubClick = () => {
    window.open("https://github.com/dante-thinkitfirst", "_blank");
  };

  const handleSpotifyClick = () => {
    window.open(
      "https://open.spotify.com/playlist/3OEaBjNVglYxPcGxqNR66Q",
      "_blank"
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden">
      <div className="mx-4 mb-4 p-3 bg-gradient-to-t from-gray-700 to-gray-800 backdrop-blur-xl rounded-3xl flex justify-around items-center max-w-[400px] mx-auto">
        <a href="tel:+1234567890" className="flex flex-col items-center">
          <div className="w-18 h-18 bg-gradient-to-t from-green-600 to-green-400 rounded-2xl flex items-center justify-center">
            <IoIosCall size={60} className="text-white" />
          </div>
        </a>

        <button
          onClick={onToggleProjects}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-18 h-18 bg-gradient-to-t from-blue-400 to-blue-300 rounded-2xl flex items-center justify-center">
            <IoFolderOpenOutline size={55} className="text-white" />
          </div>
        </button>

        <button
          onClick={handleEmailClick}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-18 h-18 bg-gradient-to-t from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center">
            <IoIosMail size={60} className="text-white" />
          </div>
        </button>

        <button
          onClick={handleGithubClick}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-18 h-18 bg-gradient-to-t from-black to-black/60 rounded-2xl flex items-center justify-center">
            <BsGithub size={55} className="text-white" />
          </div>
        </button>

        <button
          onClick={handleSpotifyClick}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-18 h-18 bg-gradient-to-t from-black to-black/60 rounded-2xl flex items-center justify-center">
            <BsSpotify size={55} className="text-[#1ED760]" />
          </div>
        </button>
      </div>
    </div>
  );
}
