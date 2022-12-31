import { Form, Space, Tag, Typography } from 'antd';
import dynamic from 'next/dynamic';
import style from './TaskInfo.module.scss';
import { Task } from 'src/services/taskService';
import dayjs from 'dayjs';
import React from 'react';
const { Title, Text } = Typography;
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
type Props = {
  task: Task;
};
export default function TaskInfo({ task }: Props) {
  const startDate = task.startDate && dayjs(new Date(task.startDate)).format('MMM DD, YYYY');
  const endDate = task.endDate && dayjs(new Date(task.endDate)).format('MMM DD, YYYY');

  const priority = React.useMemo(() => {
    if (task.priority) {
      if (task.priority === 'Low') return <Tag color="success">{task.priority}</Tag>;
      else if (task.priority === 'Medium') return <Tag color="warning">{task.priority}</Tag>;
      else return <Tag color="error">{task.priority}</Tag>;
    }
  }, [task]);

  const progress = React.useMemo(() => {
    if (task.progress) {
      if (task.progress === 'NotStarted') return <Tag color="purple">{task.progress}</Tag>;
      else if (task.progress === 'InProgress') return <Tag color="cyan">{task.progress}</Tag>;
      else if (task.progress === 'Waiting') return <Tag color="warning">{task.progress}</Tag>;
      else if (task.progress === 'Defered') return <Tag color="error">{task.progress}</Tag>;
      else return <Tag color="success">{task.progress}</Tag>;
    }
  }, [task]);

  return (
    <Form layout="horizontal" labelCol={{ xs: 5 }} wrapperCol={{ xs: 12 }} labelAlign="left">
      <Form.Item colon={false} wrapperCol={{ xs: 24 }}>
        <Title level={5} style={{ margin: 0 }}>
          {task.name}
        </Title>
      </Form.Item>
      <Form.Item colon={false} label={<Text type="secondary">Assignee</Text>}>
        {task.assignee?.name}
      </Form.Item>
      {startDate && endDate && (
        <Form.Item label={<Text type="secondary">Due Date</Text>} colon={false}>
          {startDate + ' - ' + endDate}
        </Form.Item>
      )}
      <Form.Item label={<Text type="secondary">Project</Text>} colon={false}>
        {task.project?.name}
      </Form.Item>
      <Form.Item name="priority" colon={false} label={<Text type="secondary">Priority</Text>}>
        {priority}
      </Form.Item>
      <Form.Item label={<Text type="secondary">Progress</Text>} colon={false}>
        {progress}
      </Form.Item>
      <Form.Item wrapperCol={{ xs: 24 }} colon={false}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text type="secondary">Description</Text>
          <ReactQuill
            className={style['description']}
            theme="bubble"
            value={task.description}
            readOnly={true}
            modules={{ clipboard: { matchVisual: false } }}
          />
        </Space>
      </Form.Item>
    </Form>
  );
}
