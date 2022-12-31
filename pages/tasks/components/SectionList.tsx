import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Col, Row } from 'antd';
import SectionItem from 'pages/tasks/components/SectionItem';
import TaskItem from 'pages/tasks/components/TaskItem';
import React from 'react';
import { useAppDispatch } from 'src/hooks/redux';
import { useGetSectionsQuery } from 'src/services/sectionService';
import { Task, taskService, useSortTaskMutation } from 'src/services/taskService';

export default function SectionList() {
  const { data = [] } = useGetSectionsQuery();
  const [activeTask, setActiveTask] = React.useState<Task | undefined>(undefined);
  const [sortTask] = useSortTaskMutation();
  const dispatch = useAppDispatch();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeTask = active.data.current as Task | undefined;
    const overTask = over?.data.current as Task | undefined;
    if (activeTask && overTask) {
      const activeSectionId = activeTask.section.id;
      const overSectionId = overTask.section.id;
      if (activeSectionId === overSectionId && activeTask.id !== overTask.id) {
        dispatch(
          taskService.util.updateQueryData('getTasks', { sectionId: overSectionId }, (draftTasks) => {
            const oldIndex = draftTasks.findIndex((x) => x.id === activeTask.id);
            const newIndex = draftTasks.findIndex((x) => x.id === overTask.id);
            return arrayMove(draftTasks, oldIndex, newIndex);
          }),
        );
        sortTask({ activeId: activeTask.id, overId: overTask.id });
      }
    }
    setActiveTask(undefined);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const activeTask = active.data.current as Task | undefined;
    const overTask = over?.data.current as Task | undefined;
    if (activeTask && overTask) {
      const activeSectionId = activeTask.section.id;
      const overSectionId = overTask.section.id;
      if (activeSectionId === overSectionId || activeTask.id === overTask.id) return;
      dispatch(
        taskService.util.updateQueryData('getTasks', { sectionId: activeSectionId }, (draftTasks) => {
          const index = draftTasks.findIndex((x) => x.id === activeTask.id);
          draftTasks.splice(index, 1);
          return draftTasks;
        }),
      );
      dispatch(
        taskService.util.updateQueryData('getTasks', { sectionId: overSectionId }, (draftTasks) => {
          const index = draftTasks.findIndex((x) => x.id === overTask.id);
          draftTasks.splice(index, 0, { ...activeTask, section: overTask.section });
          return draftTasks;
        }),
      );
    }
  };

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const activeTask = active.data.current as Task | undefined;
    setActiveTask(activeTask);
  }

  const renderData = (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      collisionDetection={pointerWithin}
    >
      <Row gutter={8} wrap={false}>
        {data.map((item) => (
          <Col key={item.id} span={6}>
            <SectionItem section={item} />
          </Col>
        ))}
      </Row>
      <DragOverlay>{activeTask ? <TaskItem data={activeTask} /> : null}</DragOverlay>
    </DndContext>
  );
  return renderData;
}
