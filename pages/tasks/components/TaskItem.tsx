import { DeleteOutlined, DragOutlined, EditOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Col, Dropdown, Row, Space, theme, Typography } from 'antd';
import dayjs from 'dayjs';
import { setTaskSelected } from 'pages/tasks/index.slice';
import React from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks/redux';
import { Task, useDeleteTaskMutation } from 'src/services/taskService';
const { Text } = Typography;
type Props = {
  data: Task;
};

export default function TaskItem(props: Props) {
  const {
    token: { colorPrimaryBg, colorPrimaryBorder },
  } = theme.useToken();
  const taskSelected = useAppSelector((s) => s.tasks.taskSelected);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.data.id,
    data: props.data,
  });
  const containerStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const cardStyle =
    taskSelected && taskSelected.task.id === props.data.id
      ? {
          background: colorPrimaryBg,
          borderColor: colorPrimaryBorder,
        }
      : undefined;
  const { data } = props;
  const startDate = data.startDate && dayjs(new Date(data.startDate)).format('DD-MM-YYYY');
  const endDate = data.endDate && dayjs(new Date(data.endDate)).format('DD-MM-YYYY');
  const hoverable = cardStyle ? false : true;
  const [deleteTask] = useDeleteTaskMutation();
  const dispatch = useAppDispatch();

  const handleMenuClick = async ({ key, domEvent }: any) => {
    domEvent.stopPropagation();
    switch (key) {
      case 'edit':
        dispatch(setTaskSelected({ mode: 'update', task: data }));
        break;
      case 'view':
        dispatch(setTaskSelected({ mode: 'view', task: data }));
        break;
      default:
        await deleteTask(data.id).unwrap();
        break;
    }
  };

  const handleCardClick = () => {
    dispatch(setTaskSelected({ mode: 'view', task: data }));
  };

  const cardExtra = (
    <Dropdown
      trigger={['click']}
      menu={{
        items: [
          { key: 'edit', label: 'Edit', icon: <EditOutlined onClick={(e) => e.stopPropagation()} /> },
          { key: 'view', label: 'View', icon: <EyeOutlined onClick={(e) => e.stopPropagation()} /> },
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
      <EllipsisOutlined onClick={(e) => e.stopPropagation()} />
    </Dropdown>
  );

  const cardBody = (
    <Row wrap={false}>
      <Col span={22}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {data.name}
          {startDate && endDate && <Text type="secondary">{startDate + ' - ' + endDate}</Text>}
        </Space>
      </Col>
      <Col span={2}>
        <DragOutlined {...attributes} {...listeners} />
      </Col>
    </Row>
  );

  return (
    <div ref={setNodeRef} style={containerStyle}>
      <Card hoverable={hoverable} extra={cardExtra} onClick={handleCardClick} style={cardStyle}>
        {cardBody}
      </Card>
    </div>
  );
}
