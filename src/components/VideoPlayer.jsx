import { useState } from 'react';

const VideoPlayer = ({ 
  videoId, 
  title, 
  thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
  className = "" 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  if (isPlaying) {
    return (
      <div className={`relative ${className}`}>
        <iframe
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div 
      role="button"
      tabIndex={0}
      className={`relative cursor-pointer group ${className}`}
      onClick={handlePlay}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePlay();
        }
      }}
    >
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to high quality thumbnail if maxres fails
          e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }}
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-red-600 rounded-full p-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
          <div className="w-0 h-0 border-l-[20px] border-l-white border-y-[12px] border-y-transparent ml-1" />
        </div>
      </div>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white font-medium">{title}</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
