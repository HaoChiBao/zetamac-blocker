import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Carousel } from './components/Carousel'
import { GameCard } from './components/GameCard'
import { PrivacyPolicy } from './components/PrivacyPolicy'
import { Footer } from './components/Footer'
import logo from './assets/logo.png'

const Home = () => {
  const games = [
    {
      id: 1,
      title: "Arithmetic",
      description: "Improve your mental math skills with rapid-fire arithmetic problems.",
      imageUrl: undefined
    },
    {
      id: 2,
      title: "Word Hunt",
      description: "Find hidden words in a grid of letters.",
      imageUrl: undefined
    },
    {
      id: 3,
      title: "Memory Match",
      description: "Test your memory by matching pairs of cards.",
      imageUrl: undefined
    },
    {
      id: 4,
      title: "Cup Shuffle",
      description: "Follow the cup with the ball and guess where it is.",
      imageUrl: undefined
    },
    {
      id: 5,
      title: "Black Jack",
      description: "Try to get as close to 21 as possible without going over.",
      imageUrl: undefined
    }
  ];

  return (
    <div className="app-container">
      <header className="hero-section">
        <img src={logo} alt="Lowkey Smarter Logo" className="hero-logo" />
        <h1 className="hero-title">Lowkey Smarter</h1>
        <p className="hero-subtitle">Focus on what matters. Block distractions.</p>
        <p className="app-description">
          Lowkey Smarter helps you stay productive by blocking distracting websites and replacing them with brain-training or brain-rot games. 
          Turn your downtime into self-improvement time.
        </p>
        <button className="cta-button">Try Now</button>
      </header>

      <section className="games-section">
        <h2 className="section-title">Available Games</h2>
        <Carousel>
          {games.map(game => (
            <GameCard 
              key={game.id}
              title={game.title}
              description={game.description}
              imageUrl={game.imageUrl}
            />
          ))}
        </Carousel>
      </section>

      <section className="coming-soon-section">
        <h2 className="section-title">Games Coming Soon!</h2>
        <p className="coming-soon-text">More brain-teasers are on the way! Stay tuned for updates.</p>
      </section>
    </div>
  )
}

function App() {
  return (
    <div className="app-layout">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
