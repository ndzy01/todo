import serviceAxios from './http';
import { useMount } from 'ahooks';
import { Button, List, Space, Tag, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import VirtualList from 'rc-virtual-list';
import { useState } from 'react';

const ContainerHeight = 888;
const UserList = () => {
  const [s, setS] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

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
  };

  useMount(() => {
    getAll();
  });

  const del = (item: User) => {
    setLoading(true);
    serviceAxios.delete(`/users/${item.id}`).then(() => {
      getAll();
    });
  };

  return (
    <List loading={loading}>
      <VirtualList data={s} height={ContainerHeight} itemHeight={47} itemKey="id">
        {(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  用户名：{item.nickname}
                  <Popconfirm title="删除将无法恢复,确定删除?" onConfirm={() => del(item)}>
                    <Button> 删除</Button>
                  </Popconfirm>
                </div>
              }
              description={
                <div>
                  <Space style={{ marginTop: 16 }}>
                    <Tag>创建日期：{dayjs(item.createdAt).subtract(8, 'h').format('YYYY-MM-DD')}</Tag>
                    <Tag>更新日期：{dayjs(item.updatedAt).subtract(8, 'h').format('YYYY-MM-DD')}</Tag>
                  </Space>
                </div>
              }
            />
          </List.Item>
        )}
      </VirtualList>
    </List>
  );
};

export default UserList;
