import './App.css'
import Landing from './components/Landing';
import CreateRoom from './components/CreateRoom';
import ChatRoom from './components/ChatRoom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ProtectedRoute from './components/authenticate/ProtectedRoute';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/createroom" element={<ProtectedRoute element={<CreateRoom />} />} />
        <Route path="/chatroom/:description/:passphrase" element={<ProtectedRoute element={<ChatRoom />} />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
