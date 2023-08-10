import { useMount } from 'ahooks';
import { Outlet, useNavigate } from 'react-router-dom';
import { Space, Radio, Button } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useState } from 'react';

const Layout = () => {
  const navigate = useNavigate();
  const [s, setS] = useState('2');

  const goTag = () => {
    navigate('/tag');
  };

  const goCreate = () => {
    navigate('/create');
  };

  const goHome = () => {
    navigate('/');
  };

  const onChange = (e: RadioChangeEvent) => {
    setS(e.target.value);

    if (e.target.value === '2') {
      localStorage.setItem('url', 'http://localhost:3000');
      localStorage.setItem('token', '');
      navigate('/');
      window.location.reload();
    }

    if (e.target.value === '1') {
      localStorage.setItem('url', 'https://ndzy-server.vercel.app');
      localStorage.setItem('token', '');
      navigate('/');
      window.location.reload();
    }
  };

  useMount(() => {
    const url = localStorage.getItem('url') || '';

    if (url === 'https://ndzy-server.vercel.app') {
      setS('1');
    } else {
      localStorage.setItem('url', 'http://localhost:3000');
      setS('2');
    }
  });

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ paddingBottom: 16 }}>
        <Button type="link" onClick={goHome}>
          首页
        </Button>
        <Button type="link" onClick={goCreate}>
          创建待办
        </Button>
        <Button type="link" onClick={goTag}>
          标签管理
        </Button>
        <Radio.Group onChange={onChange} value={s}>
          <Radio value={'1'}>线上</Radio>
          <Radio value={'2'}>日常</Radio>
        </Radio.Group>
      </Space>
      <Outlet />
    </div>
  );
};

export default Layout;
