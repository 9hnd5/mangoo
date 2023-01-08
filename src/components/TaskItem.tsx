import Icon, {
  CheckCircleOutlined,
  CheckOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { Card, Col, Dropdown, Input, Row, Space, theme, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import Drag from 'src/assets/drag.svg?component';
import { Task } from 'src/services/taskService';
import styled from 'styled-components';
const { TextArea } = Input;

interface CardStyleProps {
  $bg?: string;
  $border?: string;
  $colorHover?: string;
}
const CardStyle = styled(Card)<CardStyleProps>`
  background: ${(props) => props?.$bg};
  border: ${(props) => `1px solid ${props?.$border}`};
  cursor: pointer;
  &:hover {
    border: ${(props) => `1px solid ${props.$colorHover}`};
  }
`;

export type TaskItemProps = {
  type?: 'view' | 'create';
  task: Task;
  isClick?: boolean;
  drag?:
    | {
        listeners: any;
        attributes: any;
      }
    | boolean;
  onDelete?: (task: Task) => void;
  onView?: (task: Task) => void;
  onComplete?: (task: Task) => void;
  onIncomplete?: (task: Task) => void;
  onPressEnter?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  onBlur?: (value: string) => void;
  onTaskClick?: (task: Task) => void;
};
export const TaskItem = (props: TaskItemProps) => {
  const {
    token: { colorPrimary, colorPrimaryBg, colorPrimaryBorder, colorBorder },
  } = theme.useToken();
  const {
    task,
    isClick,
    type = 'create',
    drag,
    onDelete,
    onComplete,
    onIncomplete,
    onView,
    onPressEnter,
    onBlur,
    onTaskClick,
  } = props;
  const startDate = task.startDate && dayjs(new Date(task.startDate)).format('MMM DD, YYYY');
  const endDate = task.endDate && dayjs(new Date(task.endDate)).format('MMM DD, YYYY');
  const [value, setValue] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value);

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      onBlur?.(value);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onTaskClick?.(task);
  };

  const handleMenuClick = (e: any) => {
    if (e.key === 'delete') {
      onDelete?.(task);
    }
    if (e.key === 'view') {
      onView?.(task);
    }
    if (e.key === 'complete') {
      onComplete?.(task);
    }
    if (e.key === 'inComplete') {
      onIncomplete?.(task);
    }
  };

  const cardTitle = React.useMemo(() => {
    if (task.isComplete) return <CheckCircleOutlined style={{ color: colorPrimary }} />;
    return <CheckCircleOutlined />;
  }, [task]);

  const cardExtra = type === 'view' && (
    <div onClick={(e) => e.stopPropagation()}>
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            { key: 'view', label: 'View', icon: <EyeOutlined /> },
            task.isComplete
              ? { key: 'inComplete', label: 'Mark Incomplete', icon: <CheckOutlined /> }
              : { key: 'complete', label: 'Mark Complete', icon: <CheckOutlined /> },
            { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true },
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
        {(function () {
          if (drag) {
            if (typeof drag === 'object') {
              return (
                <Col span={2}>
                  <Icon component={Drag} style={{ cursor: 'grab' }} {...drag.attributes} {...drag.listeners} />
                </Col>
              );
            } else {
              return (
                <Col span={2}>
                  <Icon component={Drag} style={{ cursor: 'grab' }} />
                </Col>
              );
            }
          }
        })()}
      </Row>
    ) : (
      <TextArea
        autoFocus
        style={{ padding: 0 }}
        value={value}
        autoSize={{ minRows: 1, maxRows: 1000 }}
        bordered={false}
        placeholder="Write a task name"
        onPressEnter={onPressEnter}
        onChange={handleChange}
      />
    );
  return (
    <CardStyle
      $colorHover={colorBorder}
      tabIndex={0}
      title={cardTitle}
      extra={cardExtra}
      size="small"
      {...(task.id !== 0 ? { onClick: handleClick } : { onBlur: handleBlur })}
      {...(isClick && { $bg: colorPrimaryBg, $border: colorPrimaryBorder })}
    >
      {cardBody}
    </CardStyle>
  );
};
