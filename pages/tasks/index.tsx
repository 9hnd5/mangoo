import { Avatar, Tabs, Typography } from 'antd';
import { getServerSideProps, SectionList } from 'pages/tasks/components/SectionList';
import { TaskInfo } from 'pages/tasks/components/TaskInfo';
import React from 'react';
import { useAppSelector } from 'src/hooks/redux';
import { wrapper } from 'store';
import style from './index.module.scss';
const { Title } = Typography;

const Index = () => {
  const taskSelected = useAppSelector((s) => s.tasks.taskSelected);
  const [tab, setTab] = React.useState('card');

  return (
    <div>
      <div className={style['header-right']}>
        <div className="left">
          <Avatar size={50}>HN</Avatar>
        </div>

        <div className="right">
          <div className="title-container">
            <Title level={4} style={{ margin: 0 }}>
              My Tasks
            </Title>
          </div>

          <div className="tabs-container">
            <Tabs
              className="tabs"
              defaultActiveKey="1"
              onChange={setTab}
              items={[
                { key: 'card', label: 'Card' },
                { key: 'list', label: 'List' },
                { key: 'file', label: 'File' },
              ]}
            />
          </div>
        </div>
      </div>
      <div>
        {tab === 'card' && <SectionList />}
        <TaskInfo task={taskSelected}>
          <TaskInfo.Breadcrumb />
          <TaskInfo.Form />
          <TaskInfo.SubTaskList />
        </TaskInfo>
      </div>
    </div>
  );
};

export default Index;
