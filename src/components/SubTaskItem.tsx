import { ArrowRightOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Space, theme } from 'antd';
import * as React from 'react';
import { Task } from 'src/services/taskService';
import styled from 'styled-components';

const Container = styled.div<{ borderColor: string; focus: boolean }>`
  display: flex;
  align-items: center;
  min-height: 40px;
  gap: 8px;
  border-bottom: ${(props) => `1px solid ${props.borderColor}`};
  background: ${(props) => (props.focus ? '#f1f2fc' : '')};
  cursor: pointer;
  > *,
  textarea {
    cursor: pointer;
  }
`;
const InputItem = styled.div(() => ({
  flex: '1 1 auto',
}));
const IconItem = styled.div(() => ({
  flex: '0 0 auto',
  padding: 8,
  alignSelf: 'flex-start',
}));

type Props = {
  task: Task;
  onBlur?: (id: number, name: string) => void;
  onClick?: (task: Task) => void;
  onDelete?: (task: Task) => void;
};
export const SubTaskItem = (props: Props) => {
  const {
    token: { colorBorder },
  } = theme.useToken();

  const { task, onBlur, onClick, onDelete } = props;
  const [value, setValue] = React.useState(task.name);
  const [focus, setFocus] = React.useState(!value);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value);

  const handleBlur = () => onBlur?.(task.id, value);

  const handleClick = () => onClick?.(task);

  const handleDelete = () => onDelete?.(task);

  const handleFocus = () => setFocus(true);

  const handleUnFocus = () => setFocus(false);

  return (
    <Container borderColor={colorBorder} focus={focus} onClick={handleFocus} onBlur={handleUnFocus}>
      <InputItem>
        <Input.TextArea
          value={value}
          autoFocus={focus}
          bordered={false}
          autoSize={{ minRows: 1, maxRows: 100 }}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </InputItem>
      <IconItem>
        <Space>
          <DeleteOutlined onClick={handleDelete} />
          <ArrowRightOutlined onClick={handleClick} />
        </Space>
      </IconItem>
    </Container>
  );
};
