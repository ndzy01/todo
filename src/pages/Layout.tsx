import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { ReduxContext } from '../redux';
import { useTodo } from '../hooks';

const { Header, Content } = AntLayout;
const Layout = () => {
  const { goPage, signOut } = useTodo();
  const { state } = useContext(ReduxContext);
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
  const items: MenuProps['items'] = [
    {
      label: state.user && <div className="sky-blue">{state.user.name}</div>,
      key: '',
      disabled: true,
    },
    {
      label: '待办',
      key: '/',
    },
    ...(state.user && state.user.role === '0' ? [{ label: '用户管理', key: '/users' }] : []),
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
  ];
  return (
    <AntLayout className="layout">
      <Header className="todo-header">
        <Menu className="todo-menu" onClick={onClick} mode="horizontal" items={items} />
      </Header>
      <Content>
        <div className="layout-content p-16">
          <Outlet />
        </div>
      </Content>
    </AntLayout>
  );
};
export default Layout;
