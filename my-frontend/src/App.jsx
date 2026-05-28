import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Catalog from './components/Catalog';
import GameDetails from './components/GameDetails';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Community from './components/Community';
import Support from './components/Support';
import { gameService } from './api/gameService';
import { LanguageProvider } from './context/LanguageContext';
import { cartService } from './api/cartService';
import { orderService } from './api/orderService';
import { userService } from './api/userService';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import GameManager from './components/admin/GameManager';
import UserManager from './components/admin/UserManager';
import OrderManager from './components/admin/OrderManager';
import PostManager from './components/admin/PostManager';
import Checkout from './components/Checkout';
import Orders from './components/Orders';
import Profile from './components/Profile';
import CartPage from './components/CartPage';
import VerifyEmail from './components/VerifyEmail';

import Home from './components/Home';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function AppContent() {
  const [scrolled, setScrolled] = useState(false);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleAuthError = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setCartItems([]);
      navigate('/login');
    };

    window.addEventListener('auth-error', handleAuthError);
    return () => window.removeEventListener('auth-error', handleAuthError);
  }, [navigate]);

  useEffect(() => {
    gameService.getAllGames()
      .then(data => setFeaturedGames(data.slice(0, 4)))
      .catch(err => console.error("Error fetching games:", err));

    if (token) {
      cartService.getCart()
        .then(data => setCartItems(Array.isArray(data) ? data : []))
        .catch(err => console.error("Error fetching cart:", err));
    }
  }, [token]);

  const handleGameSelect = (game) => {
    navigate(`/game/${game._id}`, { state: { game } });
    window.scrollTo(0, 0);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/catalog?search=${searchTerm}`);
      setSearchTerm('');
    }
  };

  const handleLoginSuccess = async (newToken) => {
    localStorage.setItem('token', newToken);
    const decoded = JSON.parse(atob(newToken.split('.')[1]));

    // Fetch full profile to get PII (fullName, etc.)
    try {
      const fullProfile = await userService.getProfile();
      localStorage.setItem('user', JSON.stringify(fullProfile));
      setUser(fullProfile);
    } catch (err) {
      const basicData = { id: decoded.id, username: decoded.username, role: decoded.role };
      localStorage.setItem('user', JSON.stringify(basicData));
      setUser(basicData);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCartItems([]);
    navigate('/login');
  };

  const addToCart = async (gameId) => {
    if (!token) return navigate('/login');
    try {
      const data = await cartService.addToCart(gameId);
      setCartItems(data);
      setShowCart(true);
    } catch (err) {
      alert(err.message || "Error adding to cart. Please make sure you are logged in.");
      console.error("Error adding to cart:", err);
    }
  };

  const removeFromCart = async (gameId) => {
    try {
      const data = await cartService.removeFromCart(gameId);
      setCartItems(data);
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const handleCheckout = async () => {
    try {
      const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);
      await orderService.createOrder({ items: cartItems, totalAmount });
      setCartItems([]);
      setShowCart(false);
      navigate('/checkout');
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };
  const isHomePage = location.pathname === '/';

  return (
    <div className={`app-container ${isHomePage ? 'home-page' : ''}`}>
      <Navbar 
        scrolled={scrolled}
        isHomePage={isHomePage}
        location={location}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchKeyDown={handleSearch}
        user={user}
        cartItemsCount={cartItems.length}
        onCartToggle={setShowCart}
        onLogout={handleLogout}
        onLoginClick={() => navigate('/login')}
      />

      {showCart && <Cart items={cartItems} onRemove={removeFromCart} onCheckout={handleCheckout} onClose={() => setShowCart(false)} />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home featuredGames={featuredGames} onGameSelect={handleGameSelect} />} />
          <Route path="/catalog" element={<Catalog onGameSelect={handleGameSelect} />} />
          <Route path="/game/:id" element={<GameDetails onBack={() => navigate('/catalog')} onAddToCart={addToCart} />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/community" element={<Community />} />
          <Route path="/support" element={<Support />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/cart" element={<CartPage items={cartItems} onRemove={removeFromCart} />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/games" element={<AdminLayout><GameManager /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><UserManager /></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout><OrderManager /></AdminLayout>} />
          <Route path="/admin/posts" element={<AdminLayout><PostManager /></AdminLayout>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

export default App;
