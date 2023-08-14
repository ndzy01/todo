import { Outlet, useNavigate } from 'react-router-dom';
import { Space, Button, Alert } from 'antd';
import { useMount } from 'ahooks';
import serviceAxios from './http';
import { useState } from 'react';

const Layout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();

  const goPage = (url: string) => {
    navigate(url);
  };

  const signOut = () => {
    localStorage.setItem('token', '');
    goPage('/');
    window.location.reload();
  };

  useMount(() => {
    serviceAxios.get('/users').then((res) => {
      setUser(res.data);
    });
  });

  return (
    <div>
      <Alert banner closable message="无需登录即可体验,快来尝试吧" />
      <Space style={{ paddingBottom: 16, width: '100%', flexWrap: 'wrap' }}>
        <Button type="link" onClick={() => goPage('/')}>
          首页
        </Button>
        <Button type="link" onClick={() => goPage('/create')}>
          创建待办
        </Button>
        <Button type="link" onClick={() => goPage('/tag')}>
          标签管理
        </Button>
        <Button type="link" onClick={() => goPage('/login')}>
          登陆
        </Button>
        <Button type="link" onClick={() => goPage('/register')}>
          注册
        </Button>
        <Button type="link" onClick={signOut}>
          登出
        </Button>
        {user && user.role === '0' && (
          <Button type="link" onClick={() => goPage('/users')}>
            用户管理
          </Button>
        )}
      </Space>

      <div style={{ padding: 16 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
