import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useReducer } from 'react';
import zhCn from 'antd/locale/zh_CN';
import Login from './pages/Login';
import Home from './pages/Home';
import ITag from './pages/Tag';
import NoMatch from './pages/NoMatch';
import CreateTodo from './pages/CreateTodo';
import EditTodo from './pages/EditTodo';
import Layout from './pages/Layout';
import Register from './pages/Register';
import UserList from './pages/UserList';
import { initialState, reducer, ReduxContext } from './redux';

const Router = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ConfigProvider locale={zhCn}>
      <ReduxContext.Provider value={{ state, dispatch }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="createTodo" element={<CreateTodo />} />
            <Route path="login" element={<Login />} />
            <Route path="tagsManage" element={<ITag />} />
            <Route path="register" element={<Register />} />
            <Route path="editTodo" element={<EditTodo />} />
            <Route path="users" element={<UserList />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </ReduxContext.Provider>
    </ConfigProvider>
  );
};
export default Router;
