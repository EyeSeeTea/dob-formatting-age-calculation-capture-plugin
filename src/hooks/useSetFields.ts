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
      const entries = Object.entries(fields).filter(([fieldId]) =>
        Object.values(PluginFields).includes(fieldId as PluginField)
      );

      // Update pluginState synchronously up front so effects guarded by
      // `value === pluginState.current.<field>` don't re-fire mid-dispatch.
      for (const [fieldId, value] of entries) {
        pluginState.current[fieldId as PluginField] = value;
      }

      // Capture runs program rules independently for every setFieldValue call,
      // reading the current Redux state and overlaying only the field being
      // committed. Firing all calls synchronously means each rules eval sees
      // stale values for the other fields, and the last dispatch wins. Yield a
      // macrotask between calls so each subsequent eval runs against a state
      // that already contains the previous commit.
      void (async () => {
        for (const [fieldId, value] of entries) {
          setFieldValueRef.current({
            fieldId: fieldId as PluginField,
            value: value ?? "",
            options: {
              valid: true,
              touched: true,
            },
          });
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      })();
    },
    []
  );
  return { setFields, pluginState };
}
