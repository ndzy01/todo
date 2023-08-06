import { useMount } from 'ahooks';
import { Routes, Route, Outlet, Link, useNavigate } from 'react-router-dom';
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
  return (
    <div style={{ padding: 16 }}>
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
