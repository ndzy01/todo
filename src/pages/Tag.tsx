import { useMount } from 'ahooks';
import { useContext } from 'react';
import { Button, List, Space, Popconfirm, Input } from 'antd';
import VirtualList from 'rc-virtual-list';
import { ContainerHeight } from '../const';
import { ReduxContext } from '../redux';
import { useTodo } from '../hooks';

const ITag: React.FC = () => {
  const { inputValue, initTags, delTag, handleCreateTag, setInputValue } = useTodo();
  const { state } = useContext(ReduxContext);
  useMount(() => {
    initTags();
  });
  return (
    <div>
      <h1 className="text-center">标签管理</h1>
      <Space.Compact className="w-100">
        <Input placeholder="请输入" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <Button loading={state.loading} type="primary" onClick={handleCreateTag}>
          添加
        </Button>
      </Space.Compact>
      <List loading={state.loading}>
        <VirtualList data={state.tags} height={ContainerHeight} itemKey="id">
          {(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                title={
                  <div className="between">
                    {item.name}
                    <Popconfirm title="删除将无法恢复,确定删除?" onConfirm={() => delTag(item.id)}>
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
    </div>
  );
};
export default ITag;
