import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import Chat from './pages/Chat'


function App() {

  return (
   <BrowserRouter>
      <Routes>
          <Route path='/auth' element={<Auth/>}></Route>
          <Route path='/profile' element={<Profile/>}></Route>
          <Route path='/Chat' element={<Chat/>}></Route>
          <Route path='*' element={<Auth/>}></Route>
      </Routes>
   </BrowserRouter>
  )
}

export default App
