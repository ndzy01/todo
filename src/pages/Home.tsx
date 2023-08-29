import { useMount } from 'ahooks';
import { Button, List, Space, Tag, Popconfirm, Select, Form } from 'antd';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import VirtualList from 'rc-virtual-list';
import { ContainerHeight } from '../const';
import { useResponsive } from '../hooks';
import { ReduxContext } from '../redux';
import { useTodo } from '../hooks';
import View from '../component/View';

const Home = () => {
  const { initUser, initTags, goPage, getAllTodo, finishTodo, delTodo, recoverTodo } = useTodo();
  const responsive = useResponsive();
  const [form] = Form.useForm();
  const { state } = useContext(ReduxContext);
  useMount(() => {
    initUser();
    initTags();
    getAllTodo();
  });
  return (
    <div>
      <Space className="mb-16">
        <Link to="/createTodo">创建待办</Link>
        <Link to="/tagsManage"> 标签管理</Link>
      </Space>
      {responsive.large && (
        <Form
          form={form}
          name="advanced_search"
          onFinish={(values) => {
            getAllTodo(values);
          }}
        >
          <Form.Item name="tagId" label="标签">
            <Select
              placeholder="请选择标签"
              allowClear
              options={state.tags.map((item) => ({ label: `${item.name}-(创建者: ${item.userName})`, value: item.id }))}
            />
          </Form.Item>
          <div className="text-align-right">
            <Space size="small">
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  getAllTodo();
                }}
              >
                清除
              </Button>
            </Space>
          </div>
        </Form>
      )}
      <List loading={state.loading}>
        <VirtualList data={state.list} height={responsive.large ? 1020 : ContainerHeight} itemKey="id">
          {(item) => (
            <List.Item key={item.id}>
              <div className="between w-100">
                <div>{item.name}</div>
                <div>
                  {item.isFinish === 0 ? (
                    <Space>
                      <View {...item} />
                      <Tag color="red">处理中</Tag>
                      <Button type="link" onClick={() => goPage('/editTodo', { state: { ...item } })}>
                        编辑
                      </Button>
                      <Button type="link" onClick={() => finishTodo(item)}>
                        完成
                      </Button>
                    </Space>
                  ) : item.isFinish === 1 ? (
                    <Space>
                      <View {...item} />
                      <Tag color="green">已完成</Tag>
                      <Button type="link" onClick={() => recoverTodo(item)}>
                        恢复
                      </Button>
                      <Popconfirm title="删除将无法恢复,确定删除?" onConfirm={() => delTodo(item)}>
                        <Button type="link"> 删除</Button>
                      </Popconfirm>
                    </Space>
                  ) : null}
                </div>
              </div>
            </List.Item>
          )}
        </VirtualList>
      </List>
    </div>
  );
};
export default Home;
