import { useMount } from 'ahooks';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, Space, Tag } from 'antd';
import { useState } from 'react';

const Layout = () => {
  const navigate = useNavigate();
  const [s, setS] = useState(false);

  const fun = () => {
    if (s) {
      setS(false);
      localStorage.setItem('url', 'http://localhost:3000');
      localStorage.setItem('token', '');
      navigate('/');
      window.location.reload();
    } else {
      setS(true);
      localStorage.setItem('url', 'https://ndzy-server.vercel.app');
      localStorage.setItem('token', '');
      navigate('/');
      window.location.reload();
    }
  };

  useMount(() => {
    const url = localStorage.getItem('url') || '';
    if (url === 'https://ndzy-server.vercel.app') {
      setS(true);
    } else {
      localStorage.setItem('url', 'http://localhost:3000');
      setS(false);
    }
  });

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ paddingBottom: 16 }}>
        <Button onClick={fun}>{s ? '线上' : '日常'}</Button>
        <Tag>{localStorage.getItem('url') || ''}</Tag>
      </Space>
      <Outlet />
    </div>
  );
};

export default Layout;
