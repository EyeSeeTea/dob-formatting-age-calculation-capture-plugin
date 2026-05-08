import "./index.css";
import React from "react";
import { IDataEntryPluginProps, PluginFields } from "./Plugin.types";
import { formatDate } from "./utils/formatDate";
import i18n from "@dhis2/d2-i18n";
import { calculateAge } from "./utils/calculateAge";
import { DateFormat } from "./DateFormat";

const dateFormat: DateFormat = DateFormat.MMDDYYYY; // TODO: make this configurable

const PluginInner = (propsFromParent: IDataEntryPluginProps) => {
  const setError = (value: string, error: string) => {
    // Return early if the field already shows this same error, to avoid an infinite loop
    const currentErrors = propsFromParent.errors[PluginFields.dateOfBirth];
    if (currentErrors?.includes(error)) {
      return;
    }

    // HACK: set the value twice with different values to trigger the error message
    // If this is not done, the error message will be show only after blurring the next field
    // tested with Capture 101.32.5
    propsFromParent.setFieldValue({
      fieldId: PluginFields.dateOfBirth,
      value: value + " ",
      options: {
        valid: false,
        touched: true,
        error,
      },
    });
    propsFromParent.setFieldValue({
      fieldId: PluginFields.dateOfBirth,
      value: value,
      options: {
        valid: false,
        touched: true,
        error,
      },
    });
  };

  const formatErrors = {
    [DateFormat.YYYYMMDD]: i18n.t(
      "Invalid date. Please use format YYYY-MM-DD or YYYYMMDD and ensure the date exists and is valid",
    ),
    [DateFormat.MMDDYYYY]: i18n.t(
      "Invalid date. Please use format MM-DD-YYYY, MMDDYYYY or YYYY-MM-DD and ensure the date exists and is valid",
    ),
  };

  React.useEffect(() => {
    const inputDateOfBirth = propsFromParent.values.dateOfBirth?.trim() ?? "";
    const formattedDateOfBirth = formatDate(dateFormat, inputDateOfBirth);
    if (inputDateOfBirth) {
      if (!formattedDateOfBirth) {
        setError(inputDateOfBirth, formatErrors[dateFormat]);
      } else if (
        new Date(formattedDateOfBirth).getTime() > new Date().getTime()
      ) {
        setError(
          inputDateOfBirth,
          i18n.t("Date of Birth cannot be in the future"),
        );
      } else {
        propsFromParent.setFieldValue({
          fieldId: PluginFields.dateOfBirth,
          value: formattedDateOfBirth,
          options: {
            valid: true,
            touched: true,
          },
        });
        propsFromParent.setFieldValue({
          fieldId: PluginFields.age,
          value: calculateAge(formattedDateOfBirth) + "", // setting an integer seems to cause an error
          options: {
            valid: true,
            touched: true,
          },
        });
      }
    }
  }, [propsFromParent.values.dateOfBirth]);
  return <div></div>;
};

export default PluginInner;
