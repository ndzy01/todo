import { useMount } from 'ahooks';
import { Routes, Route, Outlet, Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { useState } from 'react';
import Login from './Login';
import Home from './Home';

const App = () => {
  const navigate = useNavigate();

  useMount(() => {
    const token = localStorage.getItem('token');

    if (!token) navigate('/login');
  });

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
};

export default App;

const Layout = () => {
  const [s, setS] = useState(false);

  useMount(() => {
    const url = localStorage.getItem('url') || '';
    if (url === 'http://localhost:3000') {
      setS(false);
    } else {
      setS(true);
    }
  });

  return (
    <div style={{ padding: 16 }}>
      <Button
        onClick={() => {
          if (s) {
            setS(false);
            localStorage.setItem('url', 'http://localhost:3000');
            window.location.reload();
          } else {
            setS(true);
            localStorage.setItem('url', 'https://ndzy-server.vercel.app');
            window.location.reload();
          }
        }}
      >
        {s ? '线上' : '日常'}
      </Button>
      <Outlet />
    </div>
  );
};

const NoMatch = () => {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
};
