import { Outlet, useNavigate } from 'react-router-dom';
import { Space, Button } from 'antd';

const Layout = () => {
  const navigate = useNavigate();

  const goTag = () => {
    navigate('/tag');
  };

  const goCreate = () => {
    navigate('/create');
  };

  const goHome = () => {
    navigate('/');
  };

  const goLogin = () => {
    navigate('/login');
  };

  const goRegister = () => {
    navigate('/register');
  };

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ paddingBottom: 16, overflow: 'scroll', width: '100%' }}>
        <Button type="link" onClick={goHome}>
          首页
        </Button>
        <Button type="link" onClick={goCreate}>
          创建待办
        </Button>
        <Button type="link" onClick={goTag}>
          标签管理
        </Button>
        <Button type="link" onClick={goLogin}>
          登陆
        </Button>
        <Button type="link" onClick={goRegister}>
          注册
        </Button>
      </Space>
      <Outlet />
    </div>
  );
};

export default Layout;
