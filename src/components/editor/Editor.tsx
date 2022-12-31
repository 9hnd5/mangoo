import dynamic from 'next/dynamic';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
import style from './Editor.module.scss';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type DefaultProps = React.ComponentPropsWithoutRef<typeof ReactQuill>;
type EditorProps<T extends FieldValues> = Omit<DefaultProps, 'name' | 'defaultValue' | 'ref'> & UseControllerProps<T>;
export const Editor = <T extends FieldValues>(props: EditorProps<T>) => {
  const { name, control, defaultValue, shouldUnregister, onChange, onBlur, ...restProps } = props;
  const { field } = useController({
    name,
    control,
    defaultValue,
    shouldUnregister,
  });
  return (
    <ReactQuill
      theme="snow"
      {...restProps}
      {...field}
      className={style['editor']}
      onBlur={(pre, source, editor) => {
        onBlur?.(pre, source, editor);
        field.onBlur();
      }}
      onChange={(value, delta, source, editor) => {
        onChange?.(value, delta, source, editor);
        field.onChange(value, delta, source, editor);
      }}
    />
  );
};
