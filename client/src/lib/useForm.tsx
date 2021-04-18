import React, { useState } from "react";

export interface UseFormMethods<FormFields> {
  setFieldValue: (key: keyof FormFields, value: any) => void;
  setFieldsValue: React.Dispatch<React.SetStateAction<FormFields>>;
  getFieldValue: (key: keyof FormFields) => any;
  getFieldsValue: FormFields;
  getFieldProps: (
    key: keyof FormFields,
  ) => {
    name: keyof FormFields;
    value: FormFields[keyof FormFields];
    onChange: (event: React.ChangeEvent<any>) => void;
  };
}

export function useForm<FormFields extends { [key: string]: any }>(
  initialValues: FormFields,
): UseFormMethods<FormFields> {
  const [values, setValues] = useState<FormFields>(initialValues);

  const setFieldValue = (key: keyof FormFields, value: any) =>
    setValues({ ...values, [key]: value });

  const getFieldValue = (key: keyof FormFields) => values[key];

  const getFieldProps = (key: keyof FormFields) => ({
    name: key,
    id: key,
    value: values[key],
    onChange: (event: React.ChangeEvent<any>) =>
      setFieldValue(event.target.name as keyof FormFields, event.target.value),
  });

  return {
    getFieldProps,
    getFieldValue,
    setFieldValue,
    getFieldsValue: values,
    setFieldsValue: setValues,
  };
}
