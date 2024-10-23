import Header from "./components/Header";
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:8000');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('productSold', (data) => {
      console.log('Received productSold event:', data);
      const newNotification = `Product "${data.product.name}" has been sold!`;
      setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <Header />
      <div style={{ padding: '140px' }}>
        <h2>Shop Notifications</h2>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
