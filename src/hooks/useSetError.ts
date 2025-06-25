import React from "react";
import { IDataEntryPluginProps, PluginField } from "../Plugin.types";

export function useSetError(propsFromParent: IDataEntryPluginProps) {
  const setError = React.useCallback(
    (field: PluginField, value: string, error: string) => {
      // return early if the field already has an error to avoid infinite loops later
      if (propsFromParent.errors[field]) {
        return;
      }

      // HACK: set the value twice with different values to trigger the error message
      // If this is not done, the error message will be show only after blurring the next field
      // tested with Capture 101.32.5
      propsFromParent.setFieldValue({
        fieldId: field,
        value: value + " ",
        options: {
          valid: false,
          touched: true,
          error,
        },
      });
      propsFromParent.setFieldValue({
        fieldId: field,
        value: value,
        options: {
          valid: false,
          touched: true,
          error,
        },
      });
    },
    [propsFromParent]
  );
  return setError;
}
