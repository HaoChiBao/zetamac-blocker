import React from 'react';

interface GameCardProps {
  title: string;
  description: string;
  imageUrl?: string;
}

export const GameCard: React.FC<GameCardProps> = ({ title, description, imageUrl }) => {
  return (
    <div className="game-card">
      {imageUrl && <img src={imageUrl} alt={title} className="game-card-image" />}
      <div className="game-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};
