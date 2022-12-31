import { Select as Select } from 'antd';
import React from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';

const { Option } = Select;

type DefaultSelectProps = React.ComponentPropsWithoutRef<typeof Select>;
type TSelectProps<T extends FieldValues> = Omit<DefaultSelectProps, 'name' | 'defaultValue'> & UseControllerProps<T>;

const TSelect = <T extends FieldValues>(props: TSelectProps<T>) => {
  const { name, control, defaultValue, shouldUnregister, children, onChange, onBlur, ...restProps } = props;
  const { field } = useController({
    name,
    control,
    defaultValue,
    shouldUnregister,
  });
  return (
    <Select
      {...restProps}
      {...field}
      onBlur={(e) => {
        onBlur?.(e);
        field.onBlur();
      }}
      onSelect={(v) => field.onChange(v)}
      onChange={(value, option) => {        
        onChange?.(value, option);
        field.onChange(value, option);
      }}
    >
      {children}
    </Select>
  );
};

TSelect.TOption = Option;

export { TSelect };
