import { Outlet, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { useMount } from 'ahooks';
import type { MenuProps } from 'antd';
import serviceAxios from '../http';
import { ReduxContext } from '../redux';

const { Header, Content } = AntLayout;
const Layout = () => {
  const { state, dispatch } = useContext(ReduxContext);
  const navigate = useNavigate();

  const goPage = (url: string) => {
    navigate(url);
  };

  const signOut = () => {
    localStorage.setItem('token', '');
    goPage('/');

    window.location.reload();
  };

  const onClick: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case '/signOut':
        signOut();
        break;

      default:
        goPage(e.key);
        break;
    }
  };

  useMount(() => {
    serviceAxios.get('/users').then((res) => {
      dispatch({ type: 'UPDATE', payload: { user: res.data } });
    });
  });

  const items: MenuProps['items'] = [
    {
      label: state.user && <div className="sky-blue">{state.user.name}</div>,
      key: '',
      disabled: true,
    },
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
    ...(state.user && state.user.role === '0' ? [{ label: '用户管理', key: '/users' }] : []),
  ];

  return (
    <AntLayout className="layout">
      <Header className="todo-header">
        <Menu className="todo-menu" onClick={onClick} mode="horizontal" items={items} />
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
