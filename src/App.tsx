import { useMount, useSetState } from 'ahooks';
import type { TabsProps } from 'antd';
import { Button, Input, List, Modal, Space, Tabs } from 'antd';
import VirtualList from 'rc-virtual-list';
import serviceAxios from './http';
import ITab from './Tab';

interface ITodo {
  id: string;
  name: string;
  describe: string;
  link: string;
  [k: string]: any;
}

interface ITodoRecord {
  name: string;
  describe: string;
  link: string;
  [k: string]: any;
}

const ContainerHeight = 888;
const App = () => {
  const [s, setS] = useSetState<{
    list: ITodo[];
    delList: ITodo[];
    isShowEdit: boolean;
    todo: ITodoRecord;
    loading: boolean;
    tabKey: string;
  }>({
    list: [],
    delList: [],
    isShowEdit: false,
    todo: { name: '', describe: '', link: '' },
    loading: false,
    tabKey: '1',
  });

  const getAllTodo = () => {
    setS({ loading: true });
    serviceAxios
      .get('/todomysql/0')
      .then((res) => {
        setS({ list: res.data, loading: false });
      })
      .finally(() => {
        setS({ loading: false });
      });

    serviceAxios
      .get('/todomysql/1')
      .then((res) => {
        setS({ delList: res.data, loading: false });
      })
      .finally(() => {
        setS({ loading: false });
      });
  };

  const edit = () => {
    setS({ loading: true });
    serviceAxios
      .patch(`/todomysql/${s.todo.id}`, {
        name: s.todo?.name,
        describe: s.todo?.describe,
        link: s.todo?.link,
      })
      .then(() => {
        getAllTodo();
        setS({ isShowEdit: false, todo: { name: '', describe: '', link: '' }, loading: false });
      })
      .finally(() => {
        setS({ loading: false });
      });
  };

  const finish = (item: ITodo) => {
    setS({ loading: true });
    serviceAxios
      .patch(`/todomysql/${item.id}`, {
        isDel: true,
      })
      .then(() => {
        getAllTodo();
        setS({ loading: false });
      })
      .finally(() => {
        setS({ loading: false });
      });
  };

  const del = (item: ITodo) => {
    setS({ loading: true });
    serviceAxios
      .delete(`/todomysql/${item.id}`)
      .then(() => {
        getAllTodo();
        setS({ loading: false });
      })
      .finally(() => {
        setS({ loading: false });
      });
  };

  const recover = (item: ITodo) => {
    setS({ loading: true });
    serviceAxios
      .patch(`/todomysql/${item.id}`, {
        isDel: false,
      })
      .then(() => {
        getAllTodo();
        setS({ loading: false });
      })
      .finally(() => {
        setS({ loading: false });
      });
  };

  useMount(() => {
    getAllTodo();
  });

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
                    item.link ? (
                      <a target="_blank" href={item.link}>
                        {item.name}
                      </a>
                    ) : (
                      item.name
                    )
                  }
                  description={item.describe}
                />

                <Space>
                  <div> {item.create_at}</div>
                  <div> {item.update_at}</div>
                  <Button onClick={() => setS({ isShowEdit: true, todo: item })}> 编辑</Button>
                  <Button onClick={() => finish(item)}> 完成</Button>
                </Space>
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
                    item.link ? (
                      <a target="_blank" href={item.link}>
                        {item.name}
                      </a>
                    ) : (
                      item.name
                    )
                  }
                  description={item.describe}
                />
                <Space>
                  <Button onClick={() => recover(item)}> 恢复</Button>
                  <Button onClick={() => del(item)}> 删除</Button>
                </Space>
              </List.Item>
            )}
          </VirtualList>
        </List>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <ITab s={s} setS={setS} getAllTodo={getAllTodo} />
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
              onChange={(e) => {
                setS({ todo: { ...s.todo, name: e.target.value } });
              }}
              placeholder="名称"
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <Input.TextArea
              rows={3}
              value={s.todo?.describe}
              onChange={(e) => {
                setS({ todo: { ...s.todo, describe: e.target.value } });
              }}
              placeholder="描述"
            />
          </div>
          <div>
            <Input.TextArea
              rows={3}
              value={s.todo?.link}
              onChange={(e) => {
                setS({ todo: { ...s.todo, link: e.target.value } });
              }}
              placeholder="链接"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default App;
