/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMount, useSetState, useUpdateEffect } from 'ahooks';
import type { TabsProps } from 'antd';
import { Button, List, Space, Tabs, Tag, Select, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import VirtualList from 'rc-virtual-list';
import serviceAxios from './http';
import Preview from './component/Preview';

const ContainerHeight = 888;
const Home = () => {
  const navigate = useNavigate();
  const [s, setS] = useSetState<{
    list: ITodo[];
    delList: ITodo[];
    isShowEdit: boolean;
    isShowCreate: boolean;
    todo: ITodoRecord;
    loading: boolean;
    tabKey: string;
    tags: { id: string; name: string }[];
    tagId?: string;
  }>({
    list: [],
    delList: [],
    isShowEdit: false,
    isShowCreate: false,
    todo: { name: '', detail: '', link: '' },
    loading: false,
    tabKey: '1',
    tags: [],
  });

  const getAllTodo = () => {
    setS({ loading: true });
    serviceAxios
      .get('/todos', { params: { tagId: s.tagId } })
      .then((res) => {
        setS({
          list: res.data.filter((item: ITodo) => item.isDel === 0),
          delList: res.data.filter((item: ITodo) => item.isDel === 1),
          loading: false,
        });
      })
      .finally(() => {
        setS({ loading: false });
      });

    serviceAxios('/tags').then((res) => {
      setS({ tags: res.data || [] });
    });
  };

  const finish = (item: ITodo) => {
    setS({ loading: true });
    serviceAxios
      .patch(`/todos/${item.id}`, {
        isDel: true,
      })
      .then(() => {
        getAllTodo();
      });
  };

  const del = (item: ITodo) => {
    setS({ loading: true });
    serviceAxios.delete(`/todos/${item.id}`).then(() => {
      getAllTodo();
    });
  };

  const recover = (item: ITodo) => {
    setS({ loading: true });
    serviceAxios
      .patch(`/todos/${item.id}`, {
        isDel: false,
      })
      .then(() => {
        getAllTodo();
      });
  };

  useMount(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    } else {
      getAllTodo();
    }
  });

  useUpdateEffect(() => {
    getAllTodo();
  }, [s.tagId]);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '待办',
      children: (
        <List loading={s.loading}>
          <VirtualList data={s.list} height={ContainerHeight} itemHeight={47} itemKey="id">
            {(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {item.link ? (
                        <a target="_blank" href={item.link}>
                          {item.name}
                        </a>
                      ) : (
                        item.name
                      )}

                      <Space style={{ marginLeft: 8 }}>
                        <Button onClick={() => navigate('/edit', { state: { ...item } })}> 编辑</Button>
                        <Button onClick={() => finish(item)}> 完成</Button>
                      </Space>
                    </div>
                  }
                  description={
                    <>
                      <Preview md={item.detail} />
                      <Space style={{ marginTop: 16 }}>
                        <Tag>标签：{item.tagName}</Tag>
                        <Tag>终止日期：{dayjs(item.deadline).format('YYYY-MM-DD')}</Tag>
                      </Space>
                      <div>
                        <Space style={{ marginTop: 16 }}>
                          <Tag>创建日期：{dayjs(item.createdAt).subtract(8, 'h').format('YYYY-MM-DD HH:mm:ss')}</Tag>
                          <Tag>更新日期：{dayjs(item.updatedAt).subtract(8, 'h').format('YYYY-MM-DD HH:mm:ss')}</Tag>
                        </Space>
                      </div>
                    </>
                  }
                />
              </List.Item>
            )}
          </VirtualList>
        </List>
      ),
    },
    {
      key: '2',
      label: '已完成',
      children: (
        <List loading={s.loading}>
          <VirtualList data={s.delList} height={ContainerHeight} itemHeight={47} itemKey="id">
            {(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      {item.link ? (
                        <a target="_blank" href={item.link}>
                          {item.name}
                        </a>
                      ) : (
                        item.name
                      )}
                      <Space>
                        <Button onClick={() => recover(item)}> 恢复</Button>
                        <Popconfirm title="删除将无法恢复,确定删除?" onConfirm={() => del(item)}>
                          <Button> 删除</Button>
                        </Popconfirm>
                      </Space>
                    </div>
                  }
                  description={
                    <>
                      <Preview md={item.detail} />
                      <Space style={{ marginTop: 16 }}>
                        <Tag>标签：{item.tagName}</Tag>
                        <Tag>终止日期：{dayjs(item.deadline).format('YYYY-MM-DD')}</Tag>
                      </Space>
                      <div>
                        <Space style={{ marginTop: 16 }}>
                          <Tag>创建日期：{dayjs(item.createdAt).subtract(8, 'h').format('YYYY-MM-DD HH:mm:ss')}</Tag>
                          <Tag>更新日期：{dayjs(item.updatedAt).subtract(8, 'h').format('YYYY-MM-DD HH:mm:ss')}</Tag>
                        </Space>
                      </div>
                    </>
                  }
                />
              </List.Item>
            )}
          </VirtualList>
        </List>
      ),
    },
  ];

  return (
    <div>
      <div style={{ margin: '8px 0' }}>当前用户：{localStorage.getItem('name') || '--'}</div>
      <div style={{ display: 'flex', marginBottom: 8 }}>
        标签：
        <Select
          placeholder="请选择标签"
          allowClear
          style={{ flex: 1 }}
          value={s.tagId}
          onChange={(v) => {
            setS({ tagId: v });
          }}
          options={s.tags.map((item) => ({ label: item.name, value: item.id }))}
        />
      </div>

      <Tabs
        defaultActiveKey="1"
        activeKey={s.tabKey}
        items={items}
        onChange={(activeKey) => {
          setS({ tabKey: activeKey });
        }}
      />
    </div>
  );
};

export default Home;
