import { useMount } from 'ahooks';
import { Button, List, Space, Tag, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import VirtualList from 'rc-virtual-list';
import { useContext } from 'react';
import { ContainerHeight } from '../const';
import { ReduxContext } from '../redux';
import { useTodo } from '../hooks';

const UserList = () => {
  const { users, delUser, getUsers } = useTodo();
  const { state } = useContext(ReduxContext);

  useMount(() => {
    getUsers();
  });

  return (
    <List loading={state.loading}>
      <VirtualList data={users} height={ContainerHeight} itemKey="id">
        {(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              title={
                <div className="between">
                  用户名：{item.nickname}
                  {state.user?.role === '0' && (
                    <Popconfirm title="删除将无法恢复,确定删除?" onConfirm={() => delUser(item)}>
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
