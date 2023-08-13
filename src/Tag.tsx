import { useMount } from 'ahooks';
import serviceAxios from './http';
import { useState } from 'react';
import { Button, List, Space, Popconfirm, Input, Spin } from 'antd';
import VirtualList from 'rc-virtual-list';

const ContainerHeight = 888;
const ITag: React.FC = () => {
  const [tags, setTags] = useState<{ id: string; name: string; userName: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

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
  };

  useMount(() => {
    getAllTags();
  });

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

  return (
    <div>
      {loading ? (
        <Spin />
      ) : (
        <>
          <Space>
            <Input.TextArea
              size="small"
              style={{ width: 300 }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button type="primary" onClick={handleCreate}>
              添加
            </Button>
          </Space>

          <List loading={loading}>
            <VirtualList data={tags} height={ContainerHeight} itemHeight={47} itemKey="id">
              {(item) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {item.name}
                        <Popconfirm title="删除将无法恢复,确定删除?" onConfirm={() => del(item.id)}>
                          <Button> 删除</Button>
                        </Popconfirm>
                      </div>
                    }
                    description={
                      <div>
                        <Space style={{ marginTop: 16 }}>
                          <div>创建人：{item.userName || '--'}</div>
                        </Space>
                      </div>
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
