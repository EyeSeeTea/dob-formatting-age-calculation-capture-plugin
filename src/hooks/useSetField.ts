import React from "react";
import { IDataEntryPluginProps, PluginField } from "../Plugin.types";

export function useSetField<T>(
  propsFromParent: IDataEntryPluginProps,
  fieldId: PluginField
) {
  return React.useCallback(
    (value: T | undefined) => {
      propsFromParent.setFieldValue({
        fieldId,
        value: value ?? "",
        options: {
          valid: true,
          touched: true,
        },
      });
    },
    [propsFromParent, fieldId]
  );
}
