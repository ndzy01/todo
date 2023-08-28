import { useMount } from 'ahooks';
import { Button, List, Space, Tag, Popconfirm, Card, Select, Form, Collapse } from 'antd';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import dayjs from 'dayjs';
import VirtualList from 'rc-virtual-list';
import Preview from '../component/Preview';
import { ContainerHeight } from '../const';
import { useResponsive } from '../hooks';
import { ReduxContext } from '../redux';
import { useTodo } from '../hooks';

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
              <Collapse
                className="w-100"
                items={[
                  {
                    key: '1',
                    label: item.name,
                    children: (
                      <Card
                        className="w-100"
                        title={item.name}
                        extra={
                          item.link && (
                            <a target="_blank" href={item.link}>
                              更多
                            </a>
                          )
                        }
                      >
                        <Preview value={item.detail} />
                        <Space className="todo-home-tags">
                          <Tag color="blue">创建人：{item.userName || '--'}</Tag>
                          <Tag color="green">标签：{item.tagName || '--'}</Tag>
                          <Tag color="red">终止日期：{dayjs(item.deadline).format('YYYY-MM-DD')}</Tag>
                          <Tag>创建日期：{dayjs(item.createdAt).subtract(8, 'h').format('YYYY-MM-DD')}</Tag>
                          <Tag>更新日期：{dayjs(item.updatedAt).subtract(8, 'h').format('YYYY-MM-DD')}</Tag>
                        </Space>
                      </Card>
                    ),
                    extra:
                      item.isFinish === 0
                        ? [
                            <Tag color="red">处理中</Tag>,
                            <Button type="link" onClick={() => goPage('/editTodo', { state: { ...item } })}>
                              编辑
                            </Button>,
                            <Button type="link" onClick={() => finishTodo(item)}>
                              完成
                            </Button>,
                          ]
                        : item.isFinish === 1
                        ? [
                            <Tag color="green">已完成</Tag>,
                            <Button type="link" onClick={() => recoverTodo(item)}>
                              恢复
                            </Button>,
                            <Popconfirm title="删除将无法恢复,确定删除?" onConfirm={() => delTodo(item)}>
                              <Button type="link"> 删除</Button>
                            </Popconfirm>,
                          ]
                        : [],
                  },
                ]}
                activeKey={item.isFinish === 0 ? ['1'] : undefined}
              />
            </List.Item>
          )}
        </VirtualList>
      </List>
    </div>
  );
};
export default Home;
