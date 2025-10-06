import React from "react";
import {
  IDataEntryPluginProps,
  PluginField,
  PluginFields,
} from "../Plugin.types";

export function useSetFields(
  setFieldValue: IDataEntryPluginProps["setFieldValue"]
) {
  const pluginState = React.useRef<Partial<IDataEntryPluginProps["values"]>>(
    {}
  );
  const setFields = React.useCallback(
    (fields: Partial<IDataEntryPluginProps["values"]>) => {
      Object.entries(fields).forEach(([fieldId, value]) => {
        if (
          Object.values(PluginFields).includes(fieldId as PluginField) === false
        ) {
          return;
        }
        pluginState.current[fieldId as PluginField] = value;
        setFieldValue({
          fieldId: fieldId as PluginField,
          value: value ?? "",
          options: {
            valid: true,
            touched: true,
          },
        });
      });
    },
    [setFieldValue]
  );
  return { setFields, pluginState };
}
