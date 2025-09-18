import React from 'react';
import Button from './ui/Button';
import Icon from './AppIcon';

const PreparationVideo = ({ videos = [], onVideoPlay }) => {
  const handleVideoPlay = (video) => {
    if (video.videoUrl) {
      window.open(video.videoUrl, '_blank', 'noopener,noreferrer');
    }
    if (onVideoPlay) {
      onVideoPlay(video);
    }
  };

  const formatDuration = (duration) => {
    // Handle different duration formats
    if (!duration) return '0:00';
    
    // If it's already in HH:MM:SS format
    if (duration.includes(':')) {
      return duration;
    }
    
    // If it's in minutes (as number)
    const minutes = parseInt(duration);
    if (!isNaN(minutes)) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return hours > 0 ? `${hours}:${mins.toString().padStart(2, '0')}:00` : `${mins}:00`;
    }
    
    return duration;
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={`star-${i}`} name="Star" size={14} className="text-warning fill-current" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Icon key="half-star" name="Star" size={14} className="text-warning fill-current opacity-50" />
      );
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Icon key={`empty-star-${i}`} name="Star" size={14} className="text-muted" />
      );
    }
    
    return stars;
  };

  if (!videos || videos.length === 0) {
    return (
      <div className="bg-card rounded-lg p-8 text-center">
        <Icon name="Video" size={48} className="text-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Videos Available</h3>
        <p className="text-text-secondary">
          Instructional videos will be available here to help you prepare for your therapy.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-semibold text-foreground">
          Preparation Videos
        </h2>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="Video" size={16} />
          <span>{videos.length} video{videos.length !== 1 ? 's' : ''} available</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-card rounded-lg shadow-breathing overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Video Thumbnail */}
            <div className="relative aspect-video bg-muted group cursor-pointer" onClick={() => handleVideoPlay(video)}>
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                  <Icon name="Video" size={48} className="text-primary" />
                </div>
              )}
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Icon name="Play" size={24} className="text-primary ml-1" />
                </div>
              </div>
              
              {/* Duration Badge */}
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(video.duration)}
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                  {video.title}
                </h3>
                {video.videoUrl && (
                  <Icon 
                    name="ExternalLink" 
                    size={16} 
                    className="text-text-secondary ml-2 flex-shrink-0 cursor-pointer hover:text-primary" 
                    onClick={() => handleVideoPlay(video)}
                  />
                )}
              </div>

              <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                {video.description}
              </p>

              {/* Instructor Info */}
              {video.instructor && (
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{video.instructor}</p>
                    <p className="text-xs text-text-secondary">Instructor</p>
                  </div>
                </div>
              )}

              {/* Rating */}
              {video.rating && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStarRating(parseFloat(video.rating))}
                  </div>
                  <span className="text-sm font-medium text-foreground">{video.rating}</span>
                  <span className="text-sm text-text-secondary">rating</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleVideoPlay(video)}
                  iconName="Play"
                  iconSize={14}
                >
                  Watch Video
                </Button>
                
                {video.videoUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard?.writeText(video.videoUrl)}
                    iconName="ExternalLink"
                    iconSize={14}
                  >
                    Copy Link
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Guidelines */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Icon name="Video" size={20} className="text-primary mt-1" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">Video Guidelines</h3>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Watch videos in order for the best learning experience</li>
              <li>• Take notes and refer back as needed during preparation</li>
              <li>• Contact support if you have questions about the content</li>
              <li>• Videos open in a new tab for easy reference</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreparationVideo;