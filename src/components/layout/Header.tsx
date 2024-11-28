import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from '../../lib/auth';
import { Bell, Search, Users, Calendar, LogOut, Gamepad, User, UserPlus, Trophy } from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { search } from '../../lib/search';
import SearchResults from '../search/SearchResults';
import { useDebounce } from '../../hooks/useDebounce';

export default function Header() {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({ users: [], teams: [], games: [] });
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm) {
        setIsSearching(true);
        const results = await search(debouncedSearchTerm);
        setSearchResults(results);
        setShowResults(true);
        setIsSearching(false);
      } else {
        setSearchResults({ users: [], teams: [], games: [] });
        setShowResults(false);
      }
    };

    performSearch();
  }, [debouncedSearchTerm]);

  return (
    <header className="bg-gaming-card border-b border-gaming-neon/20 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Gamepad className="w-8 h-8 text-gaming-neon group-hover:animate-glow" />
              <span className="font-display font-bold text-xl text-white group-hover:text-gaming-neon transition-colors">
                GAMERIE
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-lg mx-8 relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowResults(true)}
                className="w-full pl-9 pr-4 py-1.5 rounded-full bg-gaming-dark/50 text-white placeholder-white/50 border border-gaming-neon/20 focus:border-gaming-neon focus:outline-none focus:ring-1 focus:ring-gaming-neon transition-all text-sm"
              />
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2">
                  <SearchResults
                    users={searchResults.users}
                    teams={searchResults.teams}
                    games={searchResults.games}
                    isLoading={isSearching}
                  />
                </div>
              )}
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            <Link 
              to="/users" 
              className="hover:text-gaming-neon transition-colors"
              title="Users"
            >
              <User className="w-6 h-6" />
            </Link>
            <Link 
              to="/teams" 
              className="hover:text-gaming-neon transition-colors"
              title="Teams"
            >
              <Users className="w-6 h-6" />
            </Link>
            <Link 
              to="/games" 
              className="hover:text-gaming-neon transition-colors"
              title="Games"
            >
              <Gamepad className="w-6 h-6" />
            </Link>
            <Link 
              to="/tournaments" 
              className="hover:text-gaming-neon transition-colors"
              title="Tournaments"
            >
              <Trophy className="w-6 h-6" />
            </Link>
            <Link 
              to="/calendar" 
              className="hover:text-gaming-neon transition-colors"
              title="Calendar"
            >
              <Calendar className="w-6 h-6" />
            </Link>
            <Link 
              to="/notifications" 
              className="hover:text-gaming-neon transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-gaming-accent text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </Link>
            {user ? (
              <>
                <Link 
                  to={`/profile/${user.id}`}
                  className="hover:ring-2 hover:ring-gaming-neon transition-all"
                  title="Profile"
                >
                  <img
                    src={user.profileImage || 'https://via.placeholder.com/32'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-gaming-neon/50"
                  />
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="hover:text-gaming-neon transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-gaming-neon transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-gaming-neon text-black rounded-md hover:bg-gaming-neon/90 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}