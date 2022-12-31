import { Input } from 'antd';
import React from 'react';
import { FieldValues, useController, UseControllerProps } from 'react-hook-form';
const { Password, TextArea, Search } = Input;

type DefaultInputProps = React.ComponentPropsWithoutRef<typeof Input>;
type TInputProps<T extends FieldValues> = Omit<DefaultInputProps, 'name' | 'defaultValue' | 'onChange' | 'ref'> &
  UseControllerProps<T>;
const TInput = <T extends FieldValues>(props: TInputProps<T>) => {
  const { name, control, defaultValue, shouldUnregister, onBlur, ...restProps } = props;
  const { field } = useController({
    name,
    control,
    defaultValue,
    shouldUnregister,
  });
  return (
    <Input
      {...restProps}
      {...field}
      onBlur={(e) => {
        onBlur?.(e);
        field.onBlur();
      }}
    />
  );
};

type DefaultPasswordProps = React.ComponentPropsWithoutRef<typeof Password>;
type TPasswordProps<T extends FieldValues> = Omit<DefaultPasswordProps, 'name' | 'defaultValue' | 'ref'> &
  UseControllerProps<T>;
const TPassword = <T extends FieldValues>(props: TPasswordProps<T>) => {
  const { name, control, defaultValue, shouldUnregister, onBlur, onChange, ...restProps } = props;
  const { field } = useController({
    name,
    control,
    defaultValue,
    shouldUnregister,
  });
  return (
    <Input.Password
      {...restProps}
      {...field}
      onBlur={(e) => {
        onBlur?.(e);
        field.onBlur();
      }}
      onChange={(e) => {
        onChange?.(e);
        field.onChange(e);
      }}
    />
  );
};

type DefaultTextAreaProps = React.ComponentPropsWithoutRef<typeof TextArea>;
type TTextAreaProps<T extends FieldValues> = Omit<DefaultTextAreaProps, 'name' | 'defaultValue' | 'ref'> &
  UseControllerProps<T>;
const TTextArea = <T extends FieldValues>(props: TTextAreaProps<T>) => {
  const { name, control, defaultValue, shouldUnregister, onBlur, onChange, ...restProps } = props;
  const { field } = useController({
    name,
    control,
    defaultValue,
    shouldUnregister,
  });
  return (
    <TextArea
      {...restProps}
      {...field}
      onBlur={(e) => {
        onBlur?.(e);
        field.onBlur();
      }}
      onChange={(e) => {
        onChange?.(e);
        field.onChange(e);
      }}
    />
  );
};

type DefaultSearchProps = React.ComponentPropsWithoutRef<typeof Search>;
type TSearchProps<T extends FieldValues> = Omit<DefaultSearchProps, 'name' | 'defaultValue' | 'onChange' | 'ref'> &
  UseControllerProps<T>;
const TSearch = <T extends FieldValues>(props: TSearchProps<T>) => {
  const { name, control, defaultValue, shouldUnregister, onBlur, ...restProps } = props;
  const { field } = useController({
    name,
    control,
    defaultValue,
    shouldUnregister,
  });
  return (
    <Search
      {...restProps}
      {...field}
      onBlur={(e) => {
        onBlur?.(e);
        field.onBlur();
      }}
    />
  );
};

TInput.TPassword = TPassword;
TInput.TTextArea = TTextArea;
TInput.TSearch = TSearch;

export { TInput };
