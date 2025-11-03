import './App.css'

function App() {
  const openMockup = (mockupName: string) => {
    window.open(`/mockups/${mockupName}.html`, '_blank')
  }

  return (
    <div className="App">
      <h1>Vale Chronicles</h1>
      <p>Golden Sun-inspired tactical RPG - In Development</p>
      
      <div className="mockup-nav">
        <h2>Available Mockups</h2>
        <div className="mockup-buttons">
          <button onClick={() => openMockup('battle-transition')}>
            Battle Transition
          </button>
          <button onClick={() => openMockup('equipment-screen')}>
            Equipment Screen
          </button>
          <button onClick={() => openMockup('rewards-screen')}>
            Rewards Screen
          </button>
          <button onClick={() => openMockup('unit-collection')}>
            Unit Collection
          </button>
          <button 
            onClick={() => openMockup('vale-village')}
            className="missing"
            title="This mockup file is missing"
          >
            Vale Village (Missing)
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
