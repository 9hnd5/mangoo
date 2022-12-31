import {
  CheckCircleOutlined,
  DeleteOutlined,
  DragOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Card, Col, Dropdown, Input, Row, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { Task } from 'src/services/taskService';
const { TextArea } = Input;
type Props = {
  type?: 'view' | 'create';
  task: Task;
  onDelete: (task: Task) => void;
  onPressEnter?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  onBlur?: (value: string) => void;
  onTaskClick?: (task: Task) => void;
};
export const TaskItem = (props: Props) => {
  const { task, type = 'create', onDelete, onPressEnter, onBlur, onTaskClick } = props;
  const startDate = task.startDate && dayjs(new Date(task.startDate)).format('MMM DD, YYYY');
  const endDate = task.endDate && dayjs(new Date(task.endDate)).format('MMM DD, YYYY');
  const [value, setValue] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value);

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => onBlur?.(value);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => onTaskClick?.(task);

  const handleMenuClick = (e: any) => {
    if (e.key === 'delete') {
      onDelete(task);
    }
  };

  const cardExtra = type === 'view' && (
    <div onClick={(e) => e.stopPropagation()}>
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            { key: 'edit', label: 'Edit', icon: <EditOutlined /> },
            { key: 'view', label: 'View', icon: <EyeOutlined /> },
            {
              key: 'delete',
              label: 'Delete',
              icon: <DeleteOutlined />,
              danger: true,
            },
          ],
          onClick: handleMenuClick,
        }}
      >
        <EllipsisOutlined />
      </Dropdown>
    </div>
  );

  const cardBody =
    type === 'view' ? (
      <Row wrap={false}>
        <Col span={22}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {task.name}
            {startDate && endDate && (
              <Typography.Text style={{ fontSize: 12 }} type="secondary">
                {startDate + ' - ' + endDate}
              </Typography.Text>
            )}
          </Space>
        </Col>
        <Col span={2}>
          <DragOutlined />
          {/* <DragOutlined {...attributes} {...listeners} /> */}
        </Col>
      </Row>
    ) : (
      <TextArea
        autoFocus
        value={value}
        autoSize={{ minRows: 1, maxRows: 1000 }}
        bordered={false}
        placeholder="Write a task name"
        onPressEnter={onPressEnter}
        onBlur={handleBlur}
        onChange={handleChange}
      >
        <CheckCircleOutlined />
      </TextArea>
    );
  return (
    <Card title={<CheckCircleOutlined />} extra={cardExtra} size="small" onClick={handleClick}>
      {cardBody}
    </Card>
  );
};
