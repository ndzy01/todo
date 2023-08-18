import { useMount } from 'ahooks';
import serviceAxios from '../http';
import { useState, useContext } from 'react';
import { Button, List, Space, Popconfirm, Input, Spin } from 'antd';
import VirtualList from 'rc-virtual-list';
import { ContainerHeight } from '../const';
import { ReduxContext } from '../redux';

const ITag: React.FC = () => {
  const [tags, setTags] = useState<{ id: string; name: string; userName: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { dispatch } = useContext(ReduxContext);

  const getAllTags = () => {
    setLoading(true);
    serviceAxios('/tags')
      .then((res) => {
        setTags(res.data || []);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });

    serviceAxios.get('/users').then((res) => {
      dispatch({ type: 'UPDATE', payload: { user: res.data } });
    });
  };

  const del = (id: string) => {
    setLoading(true);
    serviceAxios.delete(`/tags/${id}`).then(() => {
      getAllTags();
    });
  };

  const handleCreate = () => {
    if (!inputValue) {
      return;
    }

    setLoading(true);
    serviceAxios.post('/tags', { name: inputValue }).then(() => {
      getAllTags();
      setInputValue('');
    });
  };

  useMount(() => {
    getAllTags();
  });

  return (
    <div>
      {loading ? (
        <Spin />
      ) : (
        <>
          <Space.Compact className="w-100">
            <Input placeholder="请输入" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <Button type="primary" onClick={handleCreate}>
              添加
            </Button>
          </Space.Compact>

          <List loading={loading}>
            <VirtualList data={tags} height={ContainerHeight} itemKey="id">
              {(item) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    title={
                      <div className="between">
                        {item.name}
                        <Popconfirm title="删除将无法恢复,确定删除?" onConfirm={() => del(item.id)}>
                          <Button> 删除</Button>
                        </Popconfirm>
                      </div>
                    }
                    description={
                      <Space className="mt-16">
                        <div>创建人：{item.userName || '--'}</div>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            </VirtualList>
          </List>
        </>
      )}
    </div>
  );
};

export default ITag;
