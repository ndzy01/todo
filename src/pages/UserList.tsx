import serviceAxios from '../http';
import { useMount } from 'ahooks';
import { Button, List, Space, Tag, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import VirtualList from 'rc-virtual-list';
import { useState, useContext } from 'react';
import { ContainerHeight } from '../const';
import { ReduxContext } from '../redux';

const UserList = () => {
  const [s, setS] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useContext(ReduxContext);

  const getAll = () => {
    setLoading(true);
    serviceAxios
      .get('/users/all')
      .then((res) => {
        setS(res.data);
      })
      .finally(() => {
        setLoading(false);
      });

    serviceAxios.get('/users').then((res) => {
      dispatch({ type: 'UPDATE', payload: { user: res.data } });
    });
  };

  const del = (item: User) => {
    setLoading(true);
    serviceAxios.delete(`/users/${item.id}`).then(() => {
      getAll();
    });
  };

  useMount(() => {
    getAll();
  });

  return (
    <List loading={loading}>
      <VirtualList data={s} height={ContainerHeight} itemKey="id">
        {(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              title={
                <div className="between">
                  用户名：{item.nickname}
                  {state.user?.role === '0' && (
                    <Popconfirm title="删除将无法恢复,确定删除?" onConfirm={() => del(item)}>
                      <Button> 删除</Button>
                    </Popconfirm>
                  )}
                </div>
              }
              description={
                <Space className="todo-home-tags">
                  <Tag>创建日期：{dayjs(item.createdAt).subtract(8, 'h').format('YYYY-MM-DD')}</Tag>
                  <Tag>更新日期：{dayjs(item.updatedAt).subtract(8, 'h').format('YYYY-MM-DD')}</Tag>
                </Space>
              }
            />
          </List.Item>
        )}
      </VirtualList>
    </List>
  );
};

export default UserList;
