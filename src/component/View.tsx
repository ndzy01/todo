import { useSetState } from 'ahooks';
import { Button, Drawer, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import Preview from './Preview';

const Q = (props: any) => {
  const [state, setState] = useSetState({ open: false });

  return (
    <>
      <Button type="link" onClick={() => setState({ open: true })}>
        查看
      </Button>
      <Drawer
        open={state.open}
        title={props.name}
        placement="right"
        width="100%"
        onClose={() => setState({ open: false })}
      >
        <Preview value={props.detail} />
        <Space className="todo-home-tags">
          <Tag color="blue">创建人：{props.userName || '--'}</Tag>
          <Tag color="green">标签：{props.tagName || '--'}</Tag>
          <Tag color="red">终止日期：{dayjs(props.deadline).format('YYYY-MM-DD')}</Tag>
          <Tag>创建日期：{dayjs(props.createdAt).subtract(8, 'h').format('YYYY-MM-DD')}</Tag>
          <Tag>更新日期：{dayjs(props.updatedAt).subtract(8, 'h').format('YYYY-MM-DD')}</Tag>
        </Space>
      </Drawer>
    </>
  );
};

export default Q;
