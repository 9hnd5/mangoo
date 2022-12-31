import { PlusOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { TaskList } from 'pages/tasks/components/TaskList';
import React from 'react';
import { useAppDispatch } from 'src/hooks/redux';
import { Section } from 'src/services/sectionService';
import { taskService } from 'src/services/taskService';
type Props = {
  section: Section;
  children?: React.ReactNode;
};
export default function SectionItem(props: Props) {
  const { section } = props;
  const dispatch = useAppDispatch();

  const handleCreateTask = () => {
    dispatch(
      taskService.util.updateQueryData('getTasks', { sectionId: section.id }, (draftTasks) => {
        const index = draftTasks.findIndex((x) => x.id === 0);
        if (index >= 0) return draftTasks;
        draftTasks.unshift({ id: 0, name: '', section: section, isPublic: false } as any);
        return draftTasks;
      }),
    );
  };

  return (
    <Card
      title={section.name}
      style={{ background: 'transparent' }}
      extra={<PlusOutlined onClick={handleCreateTask} />}
    >
      <TaskList section={section} />
    </Card>
  );
}
