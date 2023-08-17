import { Outlet, useNavigate } from 'react-router-dom';
import { Space, Button, Alert, Layout as AntLayout } from 'antd';
import { useMount, useInterval } from 'ahooks';
import serviceAxios from './http';
import { useState } from 'react';

const { Header, Content } = AntLayout;
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

  useInterval(
    () => {
      serviceAxios.get('/users').then((res) => {
        setUser(res.data);
      });
    },
    1000 * 60 * 30,
  );

  return (
    <AntLayout className="layout">
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          height: 'auto',
          background: '#ffffff',
          boxShadow:
            '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        }}
      >
        <Space style={{ width: '100%', flexWrap: 'wrap' }}>
          {user && <div style={{ color: 'skyblue' }}>{user.name}</div>}
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
      </Header>
      <Content>
        <Alert banner closable message="无需登录即可体验,快来尝试吧" />
        <div className="layout-content" style={{ padding: 26 }}>
          <Outlet />
        </div>
      </Content>
    </AntLayout>
  );
};

export default Layout;
