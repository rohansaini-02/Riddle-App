import { useState, useEffect } from 'react'
import './App.css'

function App() { 
  const [activeTab, setActiveTab] = useState('random') 
  const [riddle, setRiddle] = useState(null) 
  const [showAnswer, setShowAnswer] = useState(false) 
  const [favorites, setFavorites] = useState([])
 
  useEffect(() => {
    const storedFavs = JSON.parse(localStorage.getItem('favors')) || []
    setFavorites(storedFavs)
  }, [])
 
  useEffect(() => {
    if (activeTab !== 'random') return;  
    const interval = setInterval(() => {
      fetch('https://riddles-api.vercel.app/random')
        .then(res => res.json())
        .then(data => {
          setRiddle(data)
          setShowAnswer(false)
        })
        .catch(err => console.log(err))
    },5000)  

    
    fetch('https://riddles-api.vercel.app/random')
      .then(res => res.json())
      .then(data => {
        setRiddle(data)
      })
      .catch(err => console.log(err))
      
    return () => clearInterval(interval)
  }, [activeTab])

  
  const toggleAnswer = () => {
    setShowAnswer(prev => !prev)
  }
 
  const toggleFavorite = (riddle) => {
    const isFav = favorites.some(f => f.id === riddle.id)
    if (isFav) {
      const newFavs = favorites.filter(f => f.id !== riddle.id)
      setFavorites(newFavs)
      localStorage.setItem('favors', JSON.stringify(newFavs))
    } else {
      const newFavs = [...favorites, riddle]
      setFavorites(newFavs)
      localStorage.setItem('favors', JSON.stringify(newFavs))
    }
  }
 
  const isFavorite = riddle && favorites.some(f => f.id === riddle.id)

  return (
    <div className='parent'>
      <div className='NavBar'>
        <button className='riddlebtn' onClick={() => setActiveTab('random')}>
          Random Riddle
        </button>
        <button className='favouritebtn' onClick={() => setActiveTab('favourites')}>
          Favourites❤️
        </button>
      </div>

      {activeTab === 'random' && riddle && (
        <div className='riddlesDiv'>
          <h3>Riddle: {riddle.riddle}</h3>
          <button onClick={toggleAnswer} className='addFavbtn'>
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
          {showAnswer && (
            <div className='answerBox'>
              <h4>Answer: {riddle.answer}</h4>
            </div>
          )}
          <button
            className='addFavbtn'
            onClick={() => toggleFavorite(riddle)}
            style={{ backgroundColor: isFavorite ? 'tomato' : 'greenyellow', color: 'white' }}
          >
            {isFavorite ? 'Remove from Favourites' : 'Add to Favourites'}
          </button>
        </div>
      )}

      {activeTab === 'favourites' && (
        <div className='favouritesDiv'>
          {favorites.length === 0 ? (
            <p>No favorites yet!</p>
          ) : (
            favorites.map((fav) => (
              <div key={fav.id} className='favCard'>
                <h4>Riddle: {fav.riddle}</h4> 
                <button
                  className='addFavbtn'
                  onClick={() => toggleFavorite(fav)}
                  style={{ backgroundColor: 'tomato', color: 'white' }}
                >
                  Remove from Favourites
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default App




 