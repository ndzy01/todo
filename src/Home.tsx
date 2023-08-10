/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMount, useSetState, useUpdateEffect } from 'ahooks';
import type { TabsProps } from 'antd';
import { Button, Input, List, Modal, Space, Tabs, Tag, Select, DatePicker, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import VirtualList from 'rc-virtual-list';
import serviceAxios from './http';
import Editor from './component/Editor';
import Preview from './component/Preview';
import { disabledDate, disabledDateTime } from './utils';

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

  const edit = () => {
    if (!s.todo.name) {
      message.error('名称不能为空');
      return;
    }

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
                        <Button onClick={() => setS({ isShowEdit: true, todo: item })}> 编辑</Button>
                        <Button onClick={() => finish(item)}> 完成</Button>
                      </Space>
                    </div>
                  }
                  description={
                    <>
                      <Preview md={item.detail} />
                      <Space>
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
                      <Preview md={item.detail} />
                      <Space>
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
        <Select
          placeholder="请选择标签"
          allowClear
          style={{ width: 200 }}
          value={s.tagId}
          onChange={(v) => {
            setS({ tagId: v });
          }}
          options={s.tags.map((item) => ({ label: item.name, value: item.id }))}
        />
      </Space>

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
          <div style={{ marginBottom: 8 }}>
            <Editor
              placeholder="请输入"
              value={s.todo?.detail}
              onChange={(v: string) => {
                setS({ todo: { ...s.todo, detail: v } });
              }}
            />
          </div>
          <div>
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
        </Modal>
      )}
    </div>
  );
};

export default Home;
