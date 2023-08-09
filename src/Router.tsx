import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCn from 'antd/locale/zh_CN';
import Login from './Login';
import Home from './Home';
import ITag from './Tag';
import NoMatch from './NoMatch';
import CreateTodo from './CreateTodo';
import Layout from './Layout';

const App = () => {
  return (
    <ConfigProvider locale={zhCn}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="create" element={<CreateTodo />} />
          <Route path="login" element={<Login />} />
          <Route path="tag" element={<ITag />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </ConfigProvider>
  );
};

export default App;
