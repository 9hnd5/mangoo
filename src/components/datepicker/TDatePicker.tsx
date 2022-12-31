import { DatePicker, DatePickerProps } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { useController, UseControllerProps, FieldValues } from 'react-hook-form';

const { MonthPicker, QuarterPicker, RangePicker, TimePicker, WeekPicker, YearPicker } = DatePicker;

type TDatePickerProps<T extends FieldValues> = Omit<DatePickerProps, 'name' | 'defaultValue' | 'onChange' | 'ref'> &
  UseControllerProps<T>;
const TDatePicker = <T extends FieldValues>(props: TDatePickerProps<T>) => {
  const { name, control, defaultValue, shouldUnregister, onBlur, ...restProps } = props;
  const {
    field: { onChange, value, ...restFields },
  } = useController({
    name,
    control,
    defaultValue,
    shouldUnregister,
  });

  const transform = React.useMemo(() => {
    return {
      input: (value: any) => {
        return value && dayjs(value, 'YYYY-MM-DD');
      },
      output: (value: dayjs.Dayjs | null) => {
        return value?.isValid() && value.format('YYYY-MM-DD');
      },
    };
  }, []);

  return (
    <DatePicker
      onChange={(value) => onChange(transform.output(value))}
      value={transform.input(value)}
      style={{ width: '100%' }}
      {...restProps}
      {...restFields}
      onBlur={(e) => {
        onBlur?.(e);
        restFields.onBlur();
      }}
    />
  );
};

type DefaultRangePickerProps = React.ComponentPropsWithoutRef<typeof RangePicker>;
type TRangePickerProps<T extends FieldValues> = Omit<DefaultRangePickerProps, 'name' | 'defaultValue' | 'ref'> &
  UseControllerProps<T>;
const TRangePicker = <T extends FieldValues>(props: TRangePickerProps<T>) => {
  const {
    name,
    control,
    defaultValue,
    shouldUnregister,
    format = 'DD/MM/yyyy',
    onChange,
    onBlur,
    ...restProps
  } = props;
  const { field } = useController({
    name,
    control,
    defaultValue,
    shouldUnregister,
  });

  return (
    <RangePicker
      style={{ width: '100%' }}
      format={format}
      {...restProps}
      {...field}
      onBlur={(e) => {
        onBlur?.(e);
        field.onBlur();
      }}
      onChange={(value, format) => {        
        onChange?.(value, format);
        field.onChange(value, format);
      }}
    />
  );
};
TDatePicker.TRangePicker = TRangePicker;
export { TDatePicker };
