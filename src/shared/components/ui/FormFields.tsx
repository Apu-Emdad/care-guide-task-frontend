import {
  Checkbox,
  type CheckboxProps,
  MultiSelect,
  type MultiSelectProps,
  NumberInput,
  type NumberInputProps,
  PasswordInput,
  type PasswordInputProps,
  Radio,
  type RadioGroupProps,
  Select,
  type SelectProps,
  Switch,
  type SwitchProps,
  Textarea,
  type TextareaProps,
  TextInput,
  type TextInputProps,
} from '@mantine/core';
import { DateInput, type DateInputProps } from '@mantine/dates';
import { get, useController, useFormContext } from 'react-hook-form';

type Named<P> = Omit<
  P,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'error'
> & {
  name: string;
};

const useRegistered = (name: string) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return {
    ...register(name),
    error: (get(errors, name) as { message?: string } | undefined)?.message,
  };
};

export const FormTextInput = ({ name, ...props }: Named<TextInputProps>) => {
  return <TextInput {...props} {...useRegistered(name)} />;
};

export const FormPasswordInput = ({
  name,
  ...props
}: Named<PasswordInputProps>) => {
  return <PasswordInput {...props} {...useRegistered(name)} />;
};

export const FormTextarea = ({ name, ...props }: Named<TextareaProps>) => {
  return <Textarea {...props} {...useRegistered(name)} />;
};

const useControlled = (name: string) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });
  return { field, error: fieldState.error?.message };
};

export const FormSelect = ({
  name,
  onValueChange,
  ...props
}: Named<SelectProps> & { onValueChange?: (value: string) => void }) => {
  const { field, error } = useControlled(name);
  return (
    <Select
      {...props}
      ref={field.ref}
      value={field.value || null}
      onChange={(value) => {
        field.onChange(value ?? '');
        onValueChange?.(value ?? '');
      }}
      onBlur={field.onBlur}
      error={error}
    />
  );
};

export const FormMultiSelect = ({
  name,
  ...props
}: Named<MultiSelectProps>) => {
  const { field, error } = useControlled(name);
  return (
    <MultiSelect
      {...props}
      ref={field.ref}
      value={field.value ?? []}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={error}
    />
  );
};

export const FormNumberInput = ({
  name,
  ...props
}: Named<NumberInputProps>) => {
  const { field, error } = useControlled(name);
  return (
    <NumberInput
      {...props}
      ref={field.ref}
      value={field.value ?? ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={error}
    />
  );
};

export const FormDateInput = ({ name, ...props }: Named<DateInputProps>) => {
  const { field, error } = useControlled(name);
  return (
    <DateInput
      {...props}
      ref={field.ref}
      value={field.value ?? null}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={error}
    />
  );
};

export const FormCheckbox = ({ name, ...props }: Named<CheckboxProps>) => {
  const { field, error } = useControlled(name);
  return (
    <Checkbox
      {...props}
      ref={field.ref}
      checked={!!field.value}
      onChange={(event) => field.onChange(event.currentTarget.checked)}
      onBlur={field.onBlur}
      error={error}
    />
  );
};

export const FormSwitch = ({ name, ...props }: Named<SwitchProps>) => {
  const { field, error } = useControlled(name);
  return (
    <Switch
      {...props}
      ref={field.ref}
      checked={!!field.value}
      onChange={(event) => field.onChange(event.currentTarget.checked)}
      onBlur={field.onBlur}
      error={error}
    />
  );
};

export const FormRadioGroup = ({
  name,
  children,
  ...props
}: Named<Omit<RadioGroupProps, 'children'>> & {
  children: React.ReactNode;
}) => {
  const { field, error } = useControlled(name);
  return (
    <Radio.Group
      {...props}
      value={field.value ?? ''}
      onChange={field.onChange}
      error={error}
    >
      {children}
    </Radio.Group>
  );
};
