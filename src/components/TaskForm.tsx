import { Form, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';
import { TDatePicker } from 'src/components/datepicker/TDatePicker';
import { Editor } from 'src/components/editor/Editor';
import { TInput } from 'src/components/input/TInput';
import { TSelect } from 'src/components/select/TSelect';
import style from './TaskForm.module.scss';
const { Text } = Typography;

type Props = {
  form: UseFormReturn<TaskFormType, any>;
  onNameChange?: (name: string) => void;
};
export type TaskFormType = {
  id: number;
  name: string;
  sectionId: number;
  assigneeId?: string | null;
  dueDate?: [dayjs.Dayjs, dayjs.Dayjs] | null;
  projectId?: number | null;
  priority?: 'Low' | 'Medium' | 'High' | null;
  progress?: 'NotStarted' | 'InProgress' | 'Waiting' | 'Defered' | 'Done' | null;
  description?: string | null;
  parentId?: number | null;
};
export const TaskForm = (props: Props) => {
  const { form, onNameChange } = props;
  const { errors } = form.formState;
  const { control, setValue } = form;
  const [editName, setEditName] = React.useState(false);
  const [priority, progress] = useWatch({ control, name: ['priority', 'progress'] });

  const handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { value },
    } = e;
    onNameChange?.(value);
  };

  return (
    <Form layout="horizontal" labelCol={{ xs: 5 }} wrapperCol={{ xs: 15 }} labelAlign="left">
      <Form.Item
        name="name"
        help={errors.name?.message}
        validateStatus={errors.name && 'error'}
        style={{ marginLeft: -14 }}
        wrapperCol={{ xs: 24 }}
      >
        {editName || errors.name ? (
          <TInput.TTextArea
            name="name"
            control={control}
            autoSize={{ minRows: 1, maxRows: 100 }}
            size="large"
            placeholder="Write a task name"
            onBlur={() => setEditName(false)}
            style={{ fontWeight: 600 }}
            onChange={handleNameChange}
          />
        ) : (
          <TInput.TTextArea
            name="name"
            control={control}
            className={style.name}
            autoSize={{ minRows: 1, maxRows: 100 }}
            size="large"
            placeholder="Write a task name"
            bordered={false}
            onClick={() => setEditName(true)}
          />
        )}
      </Form.Item>
      <Form.Item label={<Text type="secondary">Assignee</Text>} colon={false}>
        <TSelect name="assigneeId" control={control} showSearch placeholder="Select assignee" allowClear>
          <TSelect.TOption value="639efac909991175ab3dd193">Huy Nguyễn</TSelect.TOption>
          <TSelect.TOption value="63a3422dcd397d4f68a812f5">Hoa Nguyễn</TSelect.TOption>
        </TSelect>
      </Form.Item>
      <Form.Item label={<Text type="secondary">Due Date</Text>} name="dueDate" colon={false}>
        <TDatePicker.TRangePicker name="dueDate" control={control} format="DD-MM-YYYY" allowClear />
      </Form.Item>
      <Form.Item label={<Text type="secondary">Project</Text>} name="project" colon={false}>
        <TSelect name="projectId" control={control} placeholder="Select a project" allowClear>
          <TSelect.TOption value={1}>Mission to the moon</TSelect.TOption>
        </TSelect>
      </Form.Item>
      <Form.Item colon={false} name="priority" label={<Text type="secondary">Priority</Text>}>
        <Space style={{ width: '100%' }}>
          <Tag
            color={priority === 'Low' ? 'success' : 'default'}
            onClick={() => setValue('priority', 'Low')}
            style={{ cursor: 'pointer' }}
          >
            Low
          </Tag>
          <Tag
            color={priority === 'Medium' ? 'warning' : 'default'}
            onClick={() => setValue('priority', 'Medium')}
            style={{ cursor: 'pointer' }}
          >
            Medium
          </Tag>
          <Tag
            color={priority === 'High' ? 'error' : 'default'}
            onClick={() => setValue('priority', 'High')}
            style={{ cursor: 'pointer' }}
          >
            High
          </Tag>
        </Space>
      </Form.Item>
      <Form.Item colon={false} name="progress" wrapperCol={{ xs: 19 }} label={<Text type="secondary">Progress</Text>}>
        <Space style={{ width: '100%' }} wrap>
          <Tag
            style={{ cursor: 'pointer', width: 80, display: 'flex', justifyContent: 'center' }}
            color={progress === 'NotStarted' ? 'purple' : 'default'}
            onClick={() => setValue('progress', 'NotStarted')}
          >
            Not Started
          </Tag>
          <Tag
            style={{ cursor: 'pointer', width: 80, display: 'flex', justifyContent: 'center' }}
            color={progress === 'InProgress' ? 'cyan' : 'default'}
            onClick={() => setValue('progress', 'InProgress')}
          >
            In Process
          </Tag>
          <Tag
            style={{ cursor: 'pointer', width: 80, display: 'flex', justifyContent: 'center' }}
            color={progress === 'Waiting' ? 'warning' : 'default'}
            onClick={() => setValue('progress', 'Waiting')}
          >
            Waiting
          </Tag>
          <Tag
            style={{ cursor: 'pointer', width: 80, display: 'flex', justifyContent: 'center' }}
            color={progress === 'Defered' ? 'red' : 'default'}
            onClick={() => setValue('progress', 'Defered')}
          >
            Defered
          </Tag>
          <Tag
            style={{ cursor: 'pointer', width: 80, display: 'flex', justifyContent: 'center' }}
            color={progress === 'Done' ? 'success' : 'default'}
            onClick={() => setValue('progress', 'Done')}
          >
            Done
          </Tag>
        </Space>
      </Form.Item>
      <Form.Item wrapperCol={{ xs: 24 }} name="description" colon={false}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text type="secondary">Description</Text>
          <Editor name="description" control={control} modules={{ clipboard: { matchVisual: false } }} />
        </Space>
      </Form.Item>
    </Form>
  );
};
