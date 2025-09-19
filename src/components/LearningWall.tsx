import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Image, Video, Trophy, Star, Zap, Brain, Target, Lightbulb, Share2, Twitter, Facebook, Instagram, Copy, Check } from 'lucide-react';
import { UserProfile } from '../types/user';

interface LearningWallProps {
  user: UserProfile;
}

interface DailyPhenomenon {
  id: string;
  title: string;
  description: string;
  explanation: string;
  funFacts: string[];
  images: string[];
  videos: string[];
  games: Game[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  date: string;
}

interface Game {
  id: string;
  type: 'quiz' | 'matching' | 'puzzle' | 'simulation' | 'memory' | 'wordsearch' | 'dragdrop' | 'timeline' | 'plasticpicker';
  title: string;
  description: string;
  questions?: QuizQuestion[];
  completed: boolean;
  score?: number;
  maxScore?: number;
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const LearningWall: React.FC<LearningWallProps> = ({ user }) => {
  const [currentPhenomenon, setCurrentPhenomenon] = useState<DailyPhenomenon | null>(null);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [userProgress, setUserProgress] = useState<{[key: string]: number}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showGameModal, setShowGameModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareText, setShareText] = useState('');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStartTime, setGameStartTime] = useState(0);
  const [plasticItems, setPlasticItems] = useState<Array<{id: number, x: number, y: number, type: string}>>([]);
  const [playerPosition, setPlayerPosition] = useState({x: 50, y: 50});
  const [collectedItems, setCollectedItems] = useState(0);

  // Generate daily climate phenomenon
  const generateDailyPhenomenon = async (): Promise<DailyPhenomenon> => {
    const phenomena = [
      {
        id: '1',
        title: 'The Greenhouse Effect',
        description: 'How Earth stays warm like a cozy blanket!',
        explanation: 'The greenhouse effect is like Earth wearing a warm blanket made of gases. When sunlight hits Earth, some bounces back into space, but greenhouse gases (like carbon dioxide) trap some heat, keeping our planet warm enough for life. Without it, Earth would be freezing! But too much of these gases makes Earth too hot.',
        funFacts: [
          'Without greenhouse gases, Earth would be -18°C (0°F) - that\'s colder than Antarctica!',
          'Venus has a super strong greenhouse effect - it\'s hotter than Mercury!',
          'Greenhouse gases are like invisible blankets around our planet',
          'Plants help by absorbing CO2, but we\'re making too much!'
        ],
        images: [
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
        ],
        videos: [],
        games: [
          {
            id: 'quiz1',
            type: 'quiz',
            title: 'Greenhouse Effect Quiz',
            description: 'Test your knowledge about how Earth stays warm!',
            difficulty: 'easy',
            maxScore: 3,
            timeLimit: 60,
            questions: [
              {
                id: 'q1',
                question: 'What would happen to Earth without greenhouse gases?',
                options: ['It would be too hot', 'It would be too cold', 'Nothing would change', 'It would explode'],
                correct: 1,
                explanation: 'Without greenhouse gases, Earth would be freezing cold at -18°C!'
              },
              {
                id: 'q2',
                question: 'Which gas is NOT a greenhouse gas?',
                options: ['Carbon Dioxide', 'Water Vapor', 'Oxygen', 'Methane'],
                correct: 2,
                explanation: 'Oxygen is not a greenhouse gas - it doesn\'t trap heat!'
              },
              {
                id: 'q3',
                question: 'What happens when we have too many greenhouse gases?',
                options: ['Earth gets colder', 'Earth gets warmer', 'Nothing changes', 'Earth stops spinning'],
                correct: 1,
                explanation: 'Too many greenhouse gases trap too much heat, making Earth warmer!'
              }
            ],
            completed: false
          },
          {
            id: 'memory1',
            type: 'memory',
            title: 'Climate Memory Match',
            description: 'Match climate terms with their definitions!',
            difficulty: 'medium',
            maxScore: 8,
            timeLimit: 90,
            completed: false
          },
          {
            id: 'wordsearch1',
            type: 'wordsearch',
            title: 'Climate Word Search',
            description: 'Find hidden climate-related words!',
            difficulty: 'easy',
            maxScore: 10,
            timeLimit: 120,
            completed: false
          },
          {
            id: 'dragdrop1',
            type: 'dragdrop',
            title: 'Carbon Cycle Puzzle',
            description: 'Drag and drop to complete the carbon cycle!',
            difficulty: 'hard',
            maxScore: 6,
            timeLimit: 180,
            completed: false
          },
          {
            id: 'plasticpicker1',
            type: 'plasticpicker',
            title: 'Ocean Cleanup Challenge',
            description: 'Help clean the ocean by picking up plastic waste!',
            difficulty: 'easy',
            maxScore: 20,
            timeLimit: 60,
            completed: false
          }
        ],
        difficulty: 'beginner',
        category: 'Climate Science',
        date: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Ocean Currents',
        description: 'The ocean\'s superhighway system!',
        explanation: 'Ocean currents are like giant rivers flowing through the ocean! They carry warm water from the equator to the poles and cold water back. This helps regulate Earth\'s temperature and brings nutrients to sea creatures. The Gulf Stream is like a warm water highway that keeps Europe cozy!',
        funFacts: [
          'The Gulf Stream carries warm water equal to 100 Amazon Rivers!',
          'Ocean currents can travel at speeds up to 4 mph',
          'They help distribute heat around the planet',
          'Plastic waste travels on these currents too!'
        ],
        images: [
          'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
          'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400'
        ],
        videos: [],
        games: [
          {
            id: 'quiz2',
            type: 'quiz',
            title: 'Ocean Currents Challenge',
            description: 'Navigate through the ocean of knowledge!',
            difficulty: 'medium',
            maxScore: 2,
            timeLimit: 90,
            questions: [
              {
                id: 'q1',
                question: 'What is the Gulf Stream?',
                options: ['A type of fish', 'A warm ocean current', 'A type of seaweed', 'A deep ocean trench'],
                correct: 1,
                explanation: 'The Gulf Stream is a warm ocean current that flows from the Gulf of Mexico to Europe!'
              },
              {
                id: 'q2',
                question: 'How fast can ocean currents travel?',
                options: ['Up to 1 mph', 'Up to 4 mph', 'Up to 10 mph', 'Up to 50 mph'],
                correct: 1,
                explanation: 'Ocean currents can travel up to 4 mph - that\'s faster than walking!'
              }
            ],
            completed: false
          },
          {
            id: 'plasticpicker2',
            type: 'plasticpicker',
            title: 'Ocean Cleanup Challenge',
            description: 'Help clean the ocean by picking up plastic waste!',
            difficulty: 'easy',
            maxScore: 20,
            timeLimit: 60,
            completed: false
          }
        ],
        difficulty: 'intermediate',
        category: 'Ocean Science',
        date: new Date().toISOString()
      }
    ];

    // Return a random phenomenon for today
    const today = new Date().getDate();
    return phenomena[today % phenomena.length];
  };

  // Load today's phenomenon
  useEffect(() => {
    const loadPhenomenon = async () => {
      setIsLoading(true);
      const phenomenon = await generateDailyPhenomenon();
      setCurrentPhenomenon(phenomenon);
      setIsLoading(false);
    };
    loadPhenomenon();
  }, []);

  // Start a game
  const startGame = (game: Game) => {
    setActiveGame(game);
    setShowGameModal(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setGameScore(0);
    setShowResult(false);
    setTimeLeft(game.timeLimit || 0);
    setGameStartTime(Date.now());
    setCollectedItems(0);
    setPlayerPosition({x: 50, y: 50});
    
    // Initialize plastic picker game
    if (game.type === 'plasticpicker') {
      const items = [];
      for (let i = 0; i < 20; i++) {
        items.push({
          id: i,
          x: Math.random() * 80 + 10, // 10-90% of container width
          y: Math.random() * 60 + 20, // 20-80% of container height
          type: ['bottle', 'bag', 'straw', 'cup'][Math.floor(Math.random() * 4)]
        });
      }
      setPlasticItems(items);
    }
    
    // Start timer if game has time limit
    if (game.timeLimit) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowResult(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Handle quiz answer
  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (activeGame?.questions && activeGame.questions[currentQuestion].correct === answerIndex) {
      setGameScore(prev => prev + 1);
    }
  };

  // Next question
  const nextQuestion = () => {
    if (activeGame?.questions && currentQuestion < activeGame.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  // Complete game
  const completeGame = () => {
    if (activeGame) {
      const finalScore = gameScore;
      const timeTaken = Math.round((Date.now() - gameStartTime) / 1000);
      
      setUserProgress(prev => ({
        ...prev,
        [activeGame.id]: finalScore
      }));
      
      setTotalScore(prev => prev + finalScore);
      setGamesPlayed(prev => prev + 1);
      
      // Generate share text
      const shareMessage = `🌍 Just scored ${finalScore}/${activeGame.maxScore} in "${activeGame.title}" on WeWatch Learning Wall! 🎮 Time: ${timeTaken}s. Can you beat my score? #ClimateLearning #WeWatch`;
      setShareText(shareMessage);
      
      setShowGameModal(false);
      setActiveGame(null);
    }
  };

  // Share to social media
  const shareToSocial = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const url = encodeURIComponent(window.location.href);
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing, so we'll copy to clipboard
        copyToClipboard();
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Handle keyboard input for plastic picker game
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (activeGame?.type !== 'plasticpicker') return;
    
    // Prevent default behavior for game controls
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(e.key)) {
      e.preventDefault();
    }
    
    const moveSpeed = 5;
    setPlayerPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          newY = Math.max(10, prev.y - moveSpeed);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          newY = Math.min(90, prev.y + moveSpeed);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newX = Math.max(10, prev.x - moveSpeed);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          newX = Math.min(90, prev.x + moveSpeed);
          break;
      }
      
      // Check for collisions with plastic items
      const newPos = {x: newX, y: newY};
      const collected = plasticItems.filter(item => {
        const distance = Math.sqrt(
          Math.pow(item.x - newX, 2) + Math.pow(item.y - newY, 2)
        );
        return distance < 8; // Collection radius
      });
      
      if (collected.length > 0) {
        setPlasticItems(prev => prev.filter(item => 
          !collected.some(c => c.id === item.id)
        ));
        setCollectedItems(prev => prev + collected.length);
        setGameScore(prev => prev + collected.length);
        
        // Announce collection to screen readers
        const announcement = `Collected ${collected.length} plastic item${collected.length > 1 ? 's' : ''}. ${plasticItems.length - collected.length} items remaining.`;
        const announcementElement = document.createElement('div');
        announcementElement.setAttribute('aria-live', 'polite');
        announcementElement.setAttribute('aria-atomic', 'true');
        announcementElement.className = 'sr-only';
        announcementElement.textContent = announcement;
        document.body.appendChild(announcementElement);
        setTimeout(() => document.body.removeChild(announcementElement), 1000);
      }
      
      return newPos;
    });
  };

  // Handle mouse click for plastic picker game
  const handleMouseClick = (e: React.MouseEvent) => {
    if (activeGame?.type !== 'plasticpicker') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPlayerPosition({x, y});
    
    // Check for collisions with plastic items
    const collected = plasticItems.filter(item => {
      const distance = Math.sqrt(
        Math.pow(item.x - x, 2) + Math.pow(item.y - y, 2)
      );
      return distance < 8; // Collection radius
    });
    
    if (collected.length > 0) {
      setPlasticItems(prev => prev.filter(item => 
        !collected.some(c => c.id === item.id)
      ));
      setCollectedItems(prev => prev + collected.length);
      setGameScore(prev => prev + collected.length);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading today's climate phenomenon...</p>
        </div>
      </div>
    );
  }

  if (!currentPhenomenon) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-lg text-gray-600">No phenomenon available today. Check back tomorrow!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-2xl inline-block mb-4">
          <BookOpen className="h-8 w-8 text-white" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Learning Wall
        </h1>
        <p className="text-lg text-gray-600">
          Discover amazing climate phenomena every day!
        </p>
      </header>

      {/* Daily Phenomenon Card */}
      <article className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
        {/* Phenomenon Header */}
        <header className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-6 w-6" aria-hidden="true" />
                <span className="text-sm font-medium">Today's Phenomenon</span>
              </div>
              <h2 className="text-2xl font-bold">{currentPhenomenon.title}</h2>
              <p className="text-green-100 mt-1">{currentPhenomenon.description}</p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 rounded-lg px-3 py-1 text-sm" role="text" aria-label={`Difficulty level: ${currentPhenomenon.difficulty || 'beginner'}`}>
                {(currentPhenomenon.difficulty || 'beginner').toUpperCase()}
              </div>
              <div className="text-sm mt-2" role="text" aria-label={`Category: ${currentPhenomenon.category}`}>
                {currentPhenomenon.category}
              </div>
            </div>
          </div>
        </header>

        {/* Phenomenon Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Text Content */}
            <div className="space-y-6">
              {/* Explanation */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                  <span>What's Happening?</span>
                </h3>
                <p className="text-gray-700 leading-relaxed">{currentPhenomenon.explanation}</p>
              </section>

              {/* Fun Facts */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                  <span>Amazing Facts!</span>
                </h3>
                <ul className="space-y-3" role="list">
                  {currentPhenomenon.funFacts.map((fact, index) => (
                    <li key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="bg-yellow-500 rounded-full p-1 mt-0.5">
                        <Star className="h-3 w-3 text-white" aria-hidden="true" />
                      </div>
                      <p className="text-gray-700 text-sm">{fact}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Right Column - Visual Content */}
            <div className="space-y-6">
              {/* Images */}
              {currentPhenomenon.images.length > 0 && (
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Image className="h-5 w-5 text-blue-500" aria-hidden="true" />
                    <span>Visual Learning</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4" role="img" aria-label="Visual learning images">
                    {currentPhenomenon.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`${currentPhenomenon.title} visual ${index + 1} - educational image showing ${currentPhenomenon.title.toLowerCase()} phenomenon`}
                          className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-200"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <Image className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-hidden="true" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Interactive Games */}
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Play className="h-5 w-5 text-green-500" aria-hidden="true" />
                  <span>Interactive Games</span>
                </h3>
                <div className="space-y-3" role="list" aria-label="Available interactive games">
                  {currentPhenomenon.games.map((game) => (
                    <div key={game.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors duration-200" role="listitem">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{game.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{game.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              game.type === 'quiz' ? 'bg-blue-100 text-blue-800' :
                              game.type === 'matching' ? 'bg-green-100 text-green-800' :
                              game.type === 'puzzle' ? 'bg-purple-100 text-purple-800' :
                              game.type === 'plasticpicker' ? 'bg-teal-100 text-teal-800' :
                              'bg-orange-100 text-orange-800'
                            }`} role="text" aria-label={`Game type: ${game.type}`}>
                              {game.type === 'plasticpicker' ? 'OCEAN CLEANUP' : game.type.toUpperCase()}
                            </div>
                            {userProgress[game.id] !== undefined && (
                              <div className="flex items-center space-x-1">
                                <Trophy className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                                <span className="text-sm text-gray-600" aria-label={`Score: ${userProgress[game.id]} out of 3`}>
                                  {userProgress[game.id]}/3
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => startGame(game)}
                          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          aria-label={`Play ${game.title} - ${game.description}`}
                        >
                          <Play className="h-4 w-4" aria-hidden="true" />
                          <span>Play</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </article>

      {/* Enhanced Progress Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-500" />
            <span>Your Learning Progress</span>
          </h3>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Share2 className="h-4 w-4" />
            <span>Share Progress</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {gamesPlayed}
            </div>
            <div className="text-sm text-gray-600">Games Played</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {totalScore}
            </div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {gamesPlayed > 0 ? Math.round((totalScore / (gamesPlayed * 5)) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {Object.keys(userProgress).length}
            </div>
            <div className="text-sm text-gray-600">Games Completed</div>
          </div>
        </div>

        {/* Recent Scores */}
        {Object.keys(userProgress).length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Scores</h4>
            <div className="space-y-2">
              {Object.entries(userProgress).slice(-3).map(([gameId, score]) => {
                const game = currentPhenomenon?.games.find(g => g.id === gameId);
                return (
                  <div key={gameId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              (game?.difficulty || 'easy') === 'easy' ? 'bg-green-500' :
                              (game?.difficulty || 'easy') === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                      <span className="font-medium text-gray-900">{game?.title || 'Game'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-gray-900">{score}/{game?.maxScore || 3}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Game Modal */}
      {showGameModal && activeGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{activeGame.title}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (activeGame.difficulty || 'easy') === 'easy' ? 'bg-green-100 text-green-800' :
                      (activeGame.difficulty || 'easy') === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {(activeGame.difficulty || 'easy').toUpperCase()}
                    </div>
                    {activeGame.timeLimit && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Zap className="h-4 w-4" />
                        <span>{timeLeft}s left</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowGameModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {!showResult && activeGame.questions && activeGame.type === 'quiz' && (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Question {currentQuestion + 1} of {activeGame.questions.length}</span>
                      <span>Score: {gameScore}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / activeGame.questions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      {activeGame.questions[currentQuestion].question}
                    </h4>
                    <div className="space-y-3">
                      {activeGame.questions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                            selectedAnswer === index
                              ? index === activeGame.questions![currentQuestion].correct
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-red-500 bg-red-50 text-red-700'
                              : selectedAnswer !== null && index === activeGame.questions![currentQuestion].correct
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedAnswer !== null && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-800">
                        <strong>Explanation:</strong> {activeGame.questions[currentQuestion].explanation}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={nextQuestion}
                      disabled={selectedAnswer === null}
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentQuestion < activeGame.questions.length - 1 ? 'Next Question' : 'See Results'}
                    </button>
                  </div>
                </div>
              )}

              {!showResult && activeGame.type === 'plasticpicker' && (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Items Collected: {collectedItems} / {activeGame.maxScore}</span>
                      <span>Score: {gameScore}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(collectedItems / (activeGame.maxScore || 20)) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-4 p-4 bg-blue-50 rounded-lg" id="game-instructions">
                    <p className="text-blue-800 text-sm">
                      <strong>Instructions:</strong> Use arrow keys (↑↓←→) or WASD to move, or click to teleport! 
                      Collect plastic waste to clean the ocean. Each item gives you 1 point!
                    </p>
                  </div>

                  <div 
                    className="relative bg-gradient-to-b from-blue-200 to-blue-400 rounded-lg h-96 overflow-hidden cursor-crosshair focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onKeyDown={handleKeyPress}
                    onClick={handleMouseClick}
                    tabIndex={0}
                    role="application"
                    aria-label="Ocean cleanup game area"
                    aria-describedby="game-instructions"
                  >
                    {/* Player */}
                    <div 
                      className="absolute w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10"
                      style={{ 
                        left: `${playerPosition.x}%`, 
                        top: `${playerPosition.y}%`,
                        transition: 'all 0.1s ease-out'
                      }}
                      role="img"
                      aria-label={`Ocean cleaner at position ${Math.round(playerPosition.x)}% horizontal, ${Math.round(playerPosition.y)}% vertical`}
                    >
                      <div className="w-full h-full bg-green-400 rounded-full flex items-center justify-center text-white text-xs font-bold" aria-hidden="true">
                        🧹
                      </div>
                    </div>

                    {/* Plastic Items */}
                    {plasticItems.map((item) => (
                      <div
                        key={item.id}
                        className="absolute w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                        style={{ 
                          left: `${item.x}%`, 
                          top: `${item.y}%` 
                        }}
                        role="img"
                        aria-label={`${item.type} plastic waste at position ${Math.round(item.x)}% horizontal, ${Math.round(item.y)}% vertical`}
                      >
                        <div className="w-full h-full text-lg" aria-hidden="true">
                          {item.type === 'bottle' ? '🍼' : 
                           item.type === 'bag' ? '🛍️' : 
                           item.type === 'straw' ? '🥤' : '☕'}
                        </div>
                      </div>
                    ))}

                    {/* Ocean waves animation */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-blue-600 to-transparent opacity-30">
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-blue-500 animate-pulse"></div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      {plasticItems.length === 0 ? '🎉 Ocean cleaned! Great job!' : 
                       `${plasticItems.length} items remaining`}
                    </p>
                  </div>
                </div>
              )}

              {showResult && (
                <div className="text-center">
                  <div className="mb-6">
                    <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      {activeGame.type === 'plasticpicker' ? 'Ocean Cleanup Complete!' : 'Quiz Complete!'}
                    </h4>
                    <p className="text-lg text-gray-600">
                      {activeGame.type === 'plasticpicker' 
                        ? `You collected ${gameScore} plastic items!`
                        : `You scored ${gameScore} out of ${activeGame.questions?.length || 0}!`
                      }
                    </p>
                    <div className="mt-4">
                      <div className="text-3xl font-bold text-green-600">
                        {activeGame.type === 'plasticpicker' 
                          ? `${Math.round((gameScore / (activeGame.maxScore || 20)) * 100)}%`
                          : `${Math.round((gameScore / (activeGame.questions?.length || 1)) * 100)}%`
                        }
                      </div>
                      <div className="text-sm text-gray-600">
                        {activeGame.type === 'plasticpicker' ? 'Ocean Cleaned' : 'Accuracy'}
                      </div>
                    </div>
                    {activeGame.type === 'plasticpicker' && (
                      <div className="mt-4 p-4 bg-teal-50 rounded-lg">
                        <p className="text-teal-800 text-sm">
                          🌊 Great job helping clean the ocean! Every piece of plastic you collected 
                          makes a difference for marine life and our planet.
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={completeGame}
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Continue Learning
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Social Sharing Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Share Your Progress</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3">Share your learning achievements with friends!</p>
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                  {shareText || `🌍 I've been learning about climate science on WeWatch! Scored ${totalScore} points in ${gamesPlayed} games. Join me in making a difference! #ClimateLearning #WeWatch`}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => shareToSocial('twitter')}
                    className="flex items-center justify-center space-x-2 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    <Twitter className="h-5 w-5" />
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() => shareToSocial('facebook')}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Facebook className="h-5 w-5" />
                    <span>Facebook</span>
                  </button>
                </div>
                
                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  {copied ? (
                    <>
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningWall;
