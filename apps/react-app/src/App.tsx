

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import { LandingPage } from './pages/LandingPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/chatrandom/:userName" element={<ChatPage/>} />
          <Route path="/" element={<LandingPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

