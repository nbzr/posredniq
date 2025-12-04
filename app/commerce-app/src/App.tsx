import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { NewRequestPage } from './pages/NewRequestPage';
import { MyRequestsPage } from './pages/MyRequestsPage';
import { ProfilePage } from './pages/ProfilePage';
import { useStore } from './store';
import { useTelegram } from './hooks/useTelegram';

function App() {
  const { user } = useTelegram();
  const initUser = useStore((state) => state.initUser);

  useEffect(() => {
    if (user) {
      initUser(user);
    }
  }, [user, initUser]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/new" element={<NewRequestPage />} />
          <Route path="/my-requests" element={<MyRequestsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
