import type { FC } from 'react';
import '../App.css'; // Assuming styles are in App.css for now, or move to GameCard.css if preferred

interface GameCardProps {
  title: string;
  description: string;
  badge?: string;
}

export const GameCard: FC<GameCardProps> = ({ title, description, badge }) => (
  <div className="game-card">
    <div className="game-card-image-placeholder"></div>
    <div className="game-card-content">
      <div className="game-card-header">
        <h3>{title}</h3>
        {badge && <span className="badge">{badge}</span>}
      </div>
      <p>{description}</p>
    </div>
  </div>
);
