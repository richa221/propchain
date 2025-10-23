import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet as WalletIcon } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

interface NavbarProps {
  // keep props optional so App can still pass them (backwards-compatible)
  onConnectWallet?: () => void;
  walletConnected?: boolean;
}

const shorten = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export const Navbar: React.FC<NavbarProps> = () => {
  const location = useLocation();
  const { account, connectMetaMask } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'no_metamask' | 'error' | 'connected'>('idle');

  const isActive = (path: string) => location.pathname === path;

  const onConnectClick = () => {
    setStatus('idle');
    setShowModal(true);
  };

  const onSelectMetaMask = async () => {
    setStatus('connecting');
    try {
      await connectMetaMask();
      setStatus('connected');
    } catch (err: any) {
      if (err?.code === 'NO_METAMASK' || err?.message?.toLowerCase?.().includes('metamask')) {
        setStatus('no_metamask');
      } else if (err?.code === 4001) { // user rejected
        setStatus('idle');
      } else {
        setStatus('error');
      }
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                PropChain
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`px-3 py-2 text-sm font-medium ${isActive('/') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Home</Link>
            <Link to="/listings" className={`px-3 py-2 text-sm font-medium ${isActive('/listings') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Listings</Link>
            <Link to="/favorites" className={`px-3 py-2 text-sm font-medium ${isActive('/favorites') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Favorites</Link>
            <Link to="/dashboard" className={`px-3 py-2 text-sm font-medium ${isActive('/dashboard') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>Dashboard</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onConnectClick}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${account ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white hover:from-blue-700 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:scale-105'}`}
            >
              <WalletIcon className="w-4 h-4" />
              <span className="hidden sm:block">{account ? shorten(account) : 'Connect Wallet'}</span>
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Connect Wallet</h3>

            <div className="flex flex-col gap-3">
              <button
                onClick={onSelectMetaMask}
                disabled={status === 'connecting'}
                className="flex items-center gap-3 px-3 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-60"
              >
                <img src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg" alt="MetaMask" className="w-6 h-6" />
                <div className="flex-1 text-left">MetaMask</div>
                {status === 'connecting' && <div className="text-sm text-gray-500">Connecting…</div>}
              </button>

              {status === 'no_metamask' && (
                <div className="text-sm text-gray-700">
                  MetaMask not detected. Please install it from{' '}
                  <a href="https://metamask.io/" target="_blank" rel="noreferrer" className="text-blue-600 underline">metamask.io</a>
                </div>
              )}

              {status === 'error' && (
                <div className="text-sm text-red-600">Connection failed. Please try again.</div>
              )}

              {account && status !== 'no_metamask' && (
                <div className="mt-2 text-sm">
                  <div>Connected: <span className="font-medium">{account}</span></div>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-gray-100">Close</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};