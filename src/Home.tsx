import { useMount, useSetState, useUpdateEffect } from 'ahooks';
import { Button, List, Space, Tag, Select, Popconfirm } from 'antd';
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
    isShowEdit: boolean;
    isShowCreate: boolean;
    todo: ITodoRecord;
    loading: boolean;
    tabKey: string;
    tags: TodoTag[];
    tagId?: string;
  }>({
    list: [],
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
          list: res.data,
          loading: false,
        });
      })
      .finally(() => {
        setS({ loading: false });
      });

    serviceAxios('/tags').then((res) => {
      setS({ tags: res.data });
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

  return (
    <div>
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
          options={s.tags.map((item) => ({ label: `${item.name}-(${item.userName})`, value: item.id }))}
        />
      </div>

      <List loading={s.loading}>
        <VirtualList data={s.list} height={ContainerHeight} itemHeight={47} itemKey="id">
          {(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {item.link ? (
                      <Space>
                        <a target="_blank" href={item.link}>
                          {item.name}
                        </a>
                        <Tag color={item.isDel === 1 ? 'green' : 'red'}>{item.isDel === 1 ? '完成' : '处理中'}</Tag>
                      </Space>
                    ) : (
                      <Space>
                        {item.name}
                        <Tag color={item.isDel === 1 ? 'green' : 'red'}>{item.isDel === 1 ? '完成' : '处理中'}</Tag>
                      </Space>
                    )}

                    <Space style={{ marginLeft: 8 }}>
                      {item.isDel === 0 && (
                        <Button onClick={() => navigate('/edit', { state: { ...item } })}> 编辑</Button>
                      )}
                      {item.isDel === 0 && <Button onClick={() => finish(item)}> 完成</Button>}
                      {item.isDel === 1 && <Button onClick={() => recover(item)}> 恢复</Button>}
                      {item.isDel === 1 && (
                        <Popconfirm title="删除将无法恢复,确定删除?" onConfirm={() => del(item)}>
                          <Button> 删除</Button>
                        </Popconfirm>
                      )}
                    </Space>
                  </div>
                }
                description={
                  <>
                    <Preview md={item.detail} />
                    <Space style={{ marginTop: 16 }}>
                      <div>创建人：{item.userName || '--'}</div>
                      <Tag>标签：{item.tagName || '--'}</Tag>

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
    </div>
  );
};

export default Home;
