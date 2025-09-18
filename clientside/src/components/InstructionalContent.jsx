import React, { useState } from 'react';
import Button from './ui/Button';
import Icon from './AppIcon';

const InstructionalContent = ({ videos = [], tips = [], emergencyContact = null }) => {
  const [activeSection, setActiveSection] = useState('videos');
  const [expandedTip, setExpandedTip] = useState(null);

  const handleVideoPlay = (video) => {
    if (video.videoUrl) {
      window.open(video.videoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return '0:00';
    if (duration.includes(':')) {
      return duration;
    }
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
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={`star-${i}`} name="Star" size={14} className="text-warning" />
      );
    }
    
    const remainingStars = 5 - fullStars;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Icon key={`empty-star-${i}`} name="Star" size={14} className="text-muted" />
      );
    }
    
    return stars;
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      'Preparation Technique': 'Thermometer',
      'Mental Preparation': 'Heart', 
      'Timing & Environment': 'Sun',
      'Recovery Protocol': 'Bed',
    };
    return categoryIcons[category] || 'Star';
  };

  const toggleTip = (tipId) => {
    setExpandedTip(expandedTip === tipId ? null : tipId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-semibold text-foreground">
          Instructional Content
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={activeSection === 'videos' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('videos')}
            iconName="Video"
            iconSize={14}
          >
            Videos
          </Button>
          <Button
            variant={activeSection === 'tips' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection('tips')}
            iconName="Star"
            iconSize={14}
          >
            Expert Tips
          </Button>
        </div>
      </div>

      {/* Videos Section */}
      {activeSection === 'videos' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-sm text-text-secondary mb-4">
            <Icon name="Video" size={16} />
            <span>{videos.length} instructional video{videos.length !== 1 ? 's' : ''} available</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-card rounded-lg shadow-breathing overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Video Thumbnail */}
                <div className="relative w-full h-48 bg-muted group cursor-pointer" onClick={() => handleVideoPlay(video)}>
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
                      <Icon name="Video" size={24} className="text-primary ml-1" />
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
                    <h3 className="text-lg font-semibold text-foreground">
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

                  <p className="text-text-secondary text-sm mb-4">
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
                      iconName="Video"
                      iconSize={14}
                    >
                      Watch Video
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expert Tips Section */}
      {activeSection === 'tips' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-sm text-text-secondary mb-4">
            <Icon name="Star" size={16} />
            <span>{tips.length} expert tip{tips.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="space-y-4">
            {tips.map((tip) => (
              <div key={tip.id} className="bg-card rounded-lg shadow-breathing overflow-hidden">
                {/* Tip Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-muted/20 transition-colors duration-200"
                  onClick={() => toggleTip(tip.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon 
                          name={getCategoryIcon(tip.category)} 
                          size={20} 
                          className="text-primary"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-foreground">
                            {tip.title}
                          </h3>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-muted text-text-secondary">
                            {tip.category}
                          </span>
                        </div>
                        
                        {tip.author && (
                          <div className="flex items-center space-x-2 text-sm text-text-secondary">
                            <Icon name="User" size={14} />
                            <span>{tip.author}</span>
                            {tip.experience && (
                              <span>• {tip.experience} years experience</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className={`transform transition-transform duration-200 ${
                      expandedTip === tip.id ? 'rotate-180' : ''
                    }`}>
                      <Icon name="ChevronRight" size={20} className="text-text-secondary" />
                    </div>
                  </div>
                </div>

                {/* Tip Content */}
                {expandedTip === tip.id && (
                  <div className="px-6 pb-6">
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-text-secondary leading-relaxed">
                        {tip.content}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Guidelines */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Icon name="Video" size={20} className="text-primary mt-1" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">Guidelines</h3>
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

export default InstructionalContent;