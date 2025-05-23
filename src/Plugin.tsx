import "./index.css";
import React from "react";
import { IDataEntryPluginProps, PluginFields } from "./Plugin.types";
import { formatDate } from "./utils/formatDate";
import i18n from "@dhis2/d2-i18n";
import { calculateAge } from "./utils/calculateAge";

const PluginInner = (propsFromParent: IDataEntryPluginProps) => {
  const setError = (value: string, error: string) => {
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

  React.useEffect(() => {
    const inputDateOfBirth = propsFromParent.values.dateOfBirth;
    const formattedDateOfBirth = formatDate(inputDateOfBirth);
    if (inputDateOfBirth) {
      if (!formattedDateOfBirth) {
        setError(
          inputDateOfBirth,
          i18n.t("Invalid date format, please use YYYY-MM-DD or YYYYMMDD")
        );
      } else if (
        new Date(formattedDateOfBirth).getTime() > new Date().getTime()
      ) {
        setError(
          inputDateOfBirth,
          i18n.t("Date of Birth cannot be in the future")
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
