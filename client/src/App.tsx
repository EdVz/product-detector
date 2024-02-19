import { Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import axios from 'axios';
import Navbar from './components/navbar/Navbar';
import Products from './pages/Products';

axios.defaults.baseURL = "http://localhost:3000" //change in production
axios.defaults.withCredentials = true;

function App() {

  return (
    <div className='font-primary'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
