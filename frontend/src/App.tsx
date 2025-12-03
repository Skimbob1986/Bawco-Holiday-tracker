import React, { useState, useEffect } from 'react';
import { AuthResponse, Holiday, holidayAPI, User } from './api';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { HolidayForm } from './components/HolidayForm';
import { HolidayList } from './components/HolidayList';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchHolidays();
    }
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const response = await holidayAPI.getAll();
      setHolidays(response.data);
    } catch (error) {
      console.error('Failed to fetch holidays:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (response: AuthResponse) => {
    setUser(response.user);
    setIsLogin(true);
    fetchHolidays();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setHolidays([]);
    setShowForm(false);
    setEditingHoliday(null);
  };

  const handleHolidaySubmit = async (holiday: Holiday) => {
    setShowForm(false);
    setEditingHoliday(null);
    await fetchHolidays();
  };

  const handleDeleteHoliday = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      try {
        await holidayAPI.delete(id);
        await fetchHolidays();
      } catch (error) {
        console.error('Failed to delete holiday:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>🏖️ Holiday Tracker</h1>
        </header>
        <main className="auth-container">
          {isLogin ? (
            <LoginForm
              onSuccess={handleAuthSuccess}
              onToggleForm={() => setIsLogin(false)}
            />
          ) : (
            <RegisterForm
              onSuccess={handleAuthSuccess}
              onToggleForm={() => setIsLogin(true)}
            />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏖️ Holiday Tracker</h1>
        <div className="header-right">
          <span>Welcome, {user.name || user.email}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="holidays-container">
        {!showForm && !editingHoliday && (
          <button className="btn-add" onClick={() => setShowForm(true)}>
            + Add Holiday
          </button>
        )}

        {(showForm || editingHoliday) && (
          <HolidayForm
            holiday={editingHoliday || undefined}
            onSubmit={handleHolidaySubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingHoliday(null);
            }}
          />
        )}

        <HolidayList
          holidays={holidays}
          onEdit={(holiday) => {
            setEditingHoliday(holiday);
            setShowForm(false);
          }}
          onDelete={handleDeleteHoliday}
          loading={loading}
        />
      </main>
    </div>
  );
}

export default App;
