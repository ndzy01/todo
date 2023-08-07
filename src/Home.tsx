/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMount, useSetState, useUpdateEffect } from 'ahooks';
import type { TabsProps } from 'antd';
import { Button, Input, List, Modal, Space, Tabs, Form, Tag, Select, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { RangePickerProps } from 'antd/es/date-picker';
import VirtualList from 'rc-virtual-list';
import serviceAxios from './http';

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

const ContainerHeight = 888;
const Home = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [s, setS] = useSetState<{
    list: ITodo[];
    delList: ITodo[];
    isShowEdit: boolean;
    isShowCreate: boolean;
    todo: ITodoRecord;
    loading: boolean;
    tabKey: string;
    createLoading: boolean;
    tags: { id: string; name: string }[];
    tagId: string;
  }>({
    list: [],
    delList: [],
    isShowEdit: false,
    isShowCreate: false,
    todo: { name: '', detail: '', link: '' },
    loading: false,
    tabKey: '1',
    createLoading: false,
    tags: [],
    tagId: '',
  });

  const goTag = () => {
    navigate('/tag');
  };

  const getAllTodo = () => {
    setS({ loading: true });
    serviceAxios
      .get('/todos', { params: { tagId: s.tagId } })
      .then((res) => {
        const { list = [], delList = [] } = res.data;

        setS({ list, delList, loading: false });
      })
      .finally(() => {
        setS({ loading: false });
      });

    serviceAxios('/tags').then((res) => {
      setS({ tags: res.data || [] });
    });
  };

  const create = (values: any) => {
    setS({ createLoading: true });
    serviceAxios
      .post('/todos', { ...values })
      .then(() => {
        getAllTodo();
      })
      .finally(() => {
        setS({ createLoading: false });
        form.resetFields();
      });
  };

  const edit = () => {
    setS({ loading: true });
    serviceAxios
      .patch(`/todos/${s.todo.id}`, {
        name: s.todo.name,
        detail: s.todo.detail,
        link: s.todo.link,
        deadline: s.todo.deadline,
        tagId: s.todo.tagId,
      })
      .then(() => {
        getAllTodo();
        setS({ isShowEdit: false, todo: { name: '', detail: '', link: '' } });
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

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < dayjs().endOf('day');
  };

  const disabledDateTime = () => ({
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  });

  useMount(() => {
    const token = localStorage.getItem('token');

    if (!token) navigate('/login');

    getAllTodo();
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
                        <Button onClick={() => setS({ isShowEdit: true, todo: item })}> 编辑</Button>
                        <Button onClick={() => finish(item)}> 完成</Button>
                      </Space>
                    </div>
                  }
                  description={
                    <>
                      {item.detail}
                      <Space style={{ marginLeft: 8 }}>
                        <Tag>{item.tagName}</Tag>
                        <Tag>{dayjs(item.createdAt).subtract(8, 'h').format('YYYY-MM-DD HH:mm:ss')}</Tag>
                        <Tag>{dayjs(item.updatedAt).subtract(8, 'h').format('YYYY-MM-DD HH:mm:ss')}</Tag>
                      </Space>
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
                        <Button onClick={() => del(item)}> 删除</Button>
                      </Space>
                    </div>
                  }
                  description={
                    <>
                      {item.detail}
                      <Space style={{ marginLeft: 8 }}>
                        <Tag>{item.tagName}</Tag>
                        <Tag>{dayjs(item.createdAt).subtract(8, 'h').format('YYYY-MM-DD HH:mm:ss')}</Tag>
                        <Tag>{dayjs(item.updatedAt).subtract(8, 'h').format('YYYY-MM-DD HH:mm:ss')}</Tag>
                      </Space>
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
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={goTag}>标签管理</Button>
        <Button onClick={() => setS({ isShowCreate: !s.isShowCreate })}>
          {s.isShowCreate ? '关闭创建' : '打开创建'}
        </Button>
      </Space>
      {s.isShowCreate && (
        <Form name="register" onFinish={create} style={{ maxWidth: 336 }} scrollToFirstError form={form}>
          <Form.Item name="name" label="名称">
            <Input.TextArea rows={1} />
          </Form.Item>

          <Form.Item name="detail" label="描述">
            <Input.TextArea rows={1} />
          </Form.Item>

          <Form.Item name="link" label="链接">
            <Input.TextArea rows={1} />
          </Form.Item>

          <Form.Item
            name="tagId"
            label="标签"
            rules={[
              {
                required: true,
                message: '请选择一个标签',
              },
            ]}
          >
            <Select options={s.tags.map((item) => ({ label: item.name, value: item.id }))} />
          </Form.Item>

          <Form.Item
            name="deadline"
            label="终止时间"
            rules={[
              {
                required: true,
                message: '请选择终止时间',
              },
            ]}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={disabledDate}
              disabledTime={disabledDateTime}
              showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
            />
          </Form.Item>

          <Form.Item>
            <Button loading={s.createLoading} type="primary" htmlType="submit">
              创建
            </Button>
          </Form.Item>
        </Form>
      )}

      <Select
        allowClear
        style={{ width: 300 }}
        value={s.tagId}
        onChange={(v) => {
          setS({ tagId: v });
        }}
        options={s.tags.map((item) => ({ label: item.name, value: item.id }))}
      />

      <Tabs
        defaultActiveKey="1"
        activeKey={s.tabKey}
        items={items}
        onChange={(activeKey) => {
          setS({ tabKey: activeKey });
        }}
      />

      {s.isShowEdit && (
        <Modal
          title="编辑代办"
          okText="确定"
          cancelText="取消"
          open={s.isShowEdit}
          onOk={edit}
          okButtonProps={{ loading: s.loading }}
          onCancel={() => setS({ isShowEdit: false })}
        >
          <div style={{ marginBottom: 8 }}>
            <Input.TextArea
              rows={3}
              value={s.todo?.name}
              onChange={(e: { target: { value: any } }) => {
                setS({ todo: { ...s.todo, name: e.target.value } });
              }}
              placeholder="名称"
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <Input.TextArea
              rows={3}
              value={s.todo?.detail}
              onChange={(e: { target: { value: any } }) => {
                setS({ todo: { ...s.todo, detail: e.target.value } });
              }}
              placeholder="描述"
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <Input.TextArea
              rows={3}
              value={s.todo?.link}
              onChange={(e: { target: { value: any } }) => {
                setS({ todo: { ...s.todo, link: e.target.value } });
              }}
              placeholder="链接"
            />
          </div>
          <div>
            <Select
              style={{ width: 200 }}
              value={s.todo?.tagId}
              onChange={(v) => {
                setS({ todo: { ...s.todo, tagId: v } });
              }}
              options={s.tags.map((item) => ({ label: item.name, value: item.id }))}
            />
          </div>
          <div>
            <DatePicker
              value={dayjs(s.todo?.deadline)}
              onChange={(date) => {
                setS({ todo: { ...s.todo, deadline: date } });
              }}
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={disabledDate}
              disabledTime={disabledDateTime}
              showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;
