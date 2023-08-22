/* eslint-disable @typescript-eslint/no-explicit-any */
import { configResponsive, useResponsive as useResponsiveA } from 'ahooks';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useContext, useState } from 'react';
import { ReduxContext } from './redux';
import serviceAxios from './http';

configResponsive({
  small: 0,
  middle: 800,
  large: 1200,
});

export const useResponsive = () => {
  const responsive = useResponsiveA();

  return responsive;
};

export const useTodo = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(ReduxContext);
  const [inputValue, setInputValue] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  const goPage = (path: string, options: any = {}) => {
    navigate(path, { ...options });
  };

  const initUser = () => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });
    serviceAxios
      .get('/users')
      .then((res) => {
        dispatch({ type: 'UPDATE', payload: { user: res.data, loading: false } });
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  const initTags = () => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });
    serviceAxios('/tags')
      .then((res) => {
        dispatch({ type: 'UPDATE', payload: { tags: res.data, loading: false } });
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  // 创建待办
  const createTodo = (values: ITodo) => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });
    serviceAxios
      .post('/todos', { ...values })
      .then(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
        goPage('/');
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  // 编辑待办
  const editTodo = (values: ITodoRecord, state: { id: string }) => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });
    serviceAxios
      .patch(`/todos/${state.id}`, {
        name: values.name,
        detail: values.detail,
        link: values.link,
        deadline: dayjs(values.deadline).format('YYYY-MM-DD'),
        tagId: values.tagId,
      })
      .then(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
        goPage('/');
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  // 获取所有待办
  const getAllTodo = (params: { tagId?: string } = {}) => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });
    serviceAxios
      .get('/todos', { params: { ...params } })
      .then((res) => {
        dispatch({ type: 'UPDATE', payload: { list: res.data, loading: false } });
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  // 完成待办
  const finishTodo = (item: ITodo) => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });
    serviceAxios
      .patch(`/todos/${item.id}`, {
        isDel: true,
      })
      .then(() => {
        getAllTodo();
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  // 删除待办
  const delTodo = (item: ITodo) => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });
    serviceAxios
      .delete(`/todos/${item.id}`)
      .then(() => {
        getAllTodo();
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  // 恢复待办
  const recoverTodo = (item: ITodo) => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });
    serviceAxios
      .patch(`/todos/${item.id}`, {
        isDel: false,
      })
      .then(() => {
        getAllTodo();
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  // 登出
  const signOut = () => {
    localStorage.setItem('token', '');
    goPage('/');
    window.location.reload();
  };

  // 登录
  const login = (values: { mobile: string; password: string }) => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });

    serviceAxios
      .post('/users/login', { ...values })
      .then((res) => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
        if (res && res.data && res.data.token) {
          localStorage.setItem('token', res.data.token);
          goPage('/');
          window.location.reload();
        }
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  // 注册
  const register = (values: { nickname: string; mobile: string; password: string }) => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });
    serviceAxios
      .post('/users/register', { ...values })
      .then((res) => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
        if (res.status === 0) {
          goPage('/login');
        }
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  // 删除标签
  const delTag = (id: string) => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });
    serviceAxios
      .delete(`/tags/${id}`)
      .then(() => {
        initTags();
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  // 创建标签
  const handleCreateTag = () => {
    if (!inputValue) {
      return;
    }

    dispatch({ type: 'UPDATE', payload: { loading: true } });
    serviceAxios
      .post('/tags', { name: inputValue })
      .then(() => {
        setInputValue('');
        initTags();
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  // 获取用户列表
  const getUsers = async () => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });
    initUser();
    serviceAxios
      .get('/users/all')
      .then((res) => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
        setUsers(res.data);
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  // 删除用户
  const delUser = (item: User) => {
    dispatch({ type: 'UPDATE', payload: { loading: true } });
    serviceAxios
      .delete(`/users/${item.id}`)
      .then(() => {
        getUsers();
      })
      .catch(() => {
        dispatch({ type: 'UPDATE', payload: { loading: false } });
      });
  };

  return {
    inputValue,
    users,
    initUser,
    initTags,
    createTodo,
    editTodo,
    goPage,
    getAllTodo,
    finishTodo,
    delTodo,
    recoverTodo,
    signOut,
    login,
    register,
    delTag,
    handleCreateTag,
    setInputValue,
    getUsers,
    delUser,
  };
};
