import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './routes/Home'
import Quiz from './routes/Quiz'
import Chat from './routes/Chat'

function App() {
  return (
    <div className="App">

      <Nav />
      <div className="container">
        
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />

          <Route path="/chat" element={<Chat />} />

        </Routes>
      </div>

    </div>

  )
}

export default App