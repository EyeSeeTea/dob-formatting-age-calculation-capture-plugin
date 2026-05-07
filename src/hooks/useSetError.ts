import React from "react";
import { IDataEntryPluginProps, PluginField } from "../Plugin.types";

export function useSetError(propsFromParent: IDataEntryPluginProps) {
  const propsRef = React.useRef(propsFromParent);
  React.useEffect(() => {
    propsRef.current = propsFromParent;
  }, [propsFromParent]);

  const setError = React.useCallback(
    (field: PluginField, value: string, error: string) => {
      // return early if the field already has an error to avoid infinite loops later
      if (propsRef.current.errors[field]) {
        return;
      }

      // HACK: set the value twice with different values to trigger the error message
      // If this is not done, the error message will be show only after blurring the next field
      // tested with Capture 101.32.5
      propsRef.current.setFieldValue({
        fieldId: field,
        value: value + " ",
        options: {
          valid: false,
          touched: true,
          error,
        },
      });
      propsRef.current.setFieldValue({
        fieldId: field,
        value: value,
        options: {
          valid: false,
          touched: true,
          error,
        },
      });
    },
    []
  );
  return setError;
}
