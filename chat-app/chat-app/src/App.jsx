import './App.css'
import Landing from './components/Landing';
import CreateRoom from './components/CreateRoom';
import ChatRoom from './components/ChatRoom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ProtectedRoute from './components/authenticate/ProtectedRoute';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/createroom" element={<ProtectedRoute element={<CreateRoom />} />} />
        <Route path="/chatroom/:description/:passphrase" element={<ProtectedRoute element={<ChatRoom />} />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
