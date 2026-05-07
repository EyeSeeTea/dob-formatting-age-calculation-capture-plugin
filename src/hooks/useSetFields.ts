import React from "react";
import {
  IDataEntryPluginProps,
  PluginField,
  PluginFields,
} from "../Plugin.types";

export function useSetFields(
  setFieldValue: IDataEntryPluginProps["setFieldValue"],
  initialValues?: Partial<IDataEntryPluginProps["values"]>,
) {
  const pluginState = React.useRef<Partial<IDataEntryPluginProps["values"]>>(
    initialValues ?? {},
  );
  const setFieldValueRef = React.useRef(setFieldValue);
  React.useEffect(() => {
    setFieldValueRef.current = setFieldValue;
  }, [setFieldValue]);

  const setFields = React.useCallback(
    (fields: Partial<IDataEntryPluginProps["values"]>) => {
      Object.entries(fields).forEach(([fieldId, value]) => {
        if (
          Object.values(PluginFields).includes(fieldId as PluginField) === false
        ) {
          return;
        }
        pluginState.current[fieldId as PluginField] = value;
        setFieldValueRef.current({
          fieldId: fieldId as PluginField,
          value: value ?? "",
          options: {
            valid: true,
            touched: true,
          },
        });
      });
    },
    []
  );
  return { setFields, pluginState };
}
