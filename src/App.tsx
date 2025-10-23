import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { HomePage } from './pages/HomePage';
import { ListingsPage } from './pages/ListingsPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { DashboardPage } from './pages/DashboardPage';
import { useWallet } from './context/WalletContext';

const AppContent: React.FC = () => {
  const { account, connectMetaMask } = useWallet();
  const walletConnected = !!account;
  const [favorites, setFavorites] = React.useState(['1', '4']);
  const navigate = useNavigate();

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites(prev =>
      prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
    );
  };

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<HomePage onToggleFavorite={handleToggleFavorite} onPropertyClick={handlePropertyClick} />}
        />
        <Route
          path="/listings"
          element={<ListingsPage onToggleFavorite={handleToggleFavorite} onPropertyClick={handlePropertyClick} />}
        />
        <Route path="/property/:id" element={<PropertyDetailPage onToggleFavorite={handleToggleFavorite} />} />
        <Route
          path="/favorites"
          element={<FavoritesPage favorites={favorites} onToggleFavorite={handleToggleFavorite} onPropertyClick={handlePropertyClick} />}
        />
        <Route
          path="/dashboard"
          element={<DashboardPage walletConnected={walletConnected} onConnectWallet={connectMetaMask} />}
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;