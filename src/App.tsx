import React, { ReactNode, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { auth } from './firebase/config';


import App2 from './componets/Home';
// import Login from './firebase/LoginAuth';

const PrivateRoute: React.FC<{ redirectPath?: string; children: ReactNode }> = ({ redirectPath = "/", children }, ref) => {
  // console.trace()
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("firebaseToken");
    if (token) {
      auth.onAuthStateChanged((user) => {
        if (!user) {
          navigate(redirectPath);
        }
      });
    } else {
      navigate(redirectPath);
    }
  }, [navigate, redirectPath]);

  return <>{children}</>;
};

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<> <App2 /> </>} />
          <Route path="/parteprivada" element={<PrivateRoute redirectPath="/">{<App2 />}</PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


