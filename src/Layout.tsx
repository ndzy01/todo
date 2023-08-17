import { Outlet, useNavigate } from 'react-router-dom';
import { Layout as AntLayout, Menu } from 'antd';
import { useMount, useInterval } from 'ahooks';
import type { MenuProps } from 'antd';
import { useState } from 'react';
import serviceAxios from './http';

const { Header, Content } = AntLayout;
const Layout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const [current, setCurrent] = useState('/');

  const goPage = (url: string) => {
    navigate(url);
  };

  const signOut = () => {
    localStorage.setItem('token', '');
    goPage('/');
    window.location.reload();
  };

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === '/signOut') {
      signOut();
    } else {
      setCurrent(e.key);
      goPage(e.key);
    }
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

  const items: MenuProps['items'] = [
    {
      label: '首页',
      key: '/',
    },
    {
      label: '创建待办',
      key: '/create',
    },
    {
      label: '标签管理',
      key: '/tag',
    },
    {
      label: '登陆',
      key: '/login',
    },
    {
      label: '注册',
      key: '/register',
    },
    {
      label: '登出',
      key: '/signOut',
    },
    ...(user && user.role === '0' ? [{ label: '用户管理', key: '/users' }] : []),
    {
      label: user && <div className="sky-blue">{user.name}</div>,
      key: '',
      disabled: true,
    },
  ];

  return (
    <AntLayout className="layout">
      <Header className="todo-header">
        <Menu className="todo-menu" onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      </Header>
      <Content>
        <div className="layout-content p-24">
          <Outlet />
        </div>
      </Content>
    </AntLayout>
  );
};

export default Layout;
