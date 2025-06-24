import "./index.css";
import React from "react";
import {
  IDataEntryPluginProps,
  PluginField,
  PluginFields,
} from "./Plugin.types";
import { formatDate } from "./utils/formatDate";
import i18n from "@dhis2/d2-i18n";
import { calculateAge } from "./utils/calculateAge";
import { calculateDob } from "./utils/calculateDob";

const PluginInner = (propsFromParent: IDataEntryPluginProps) => {
  const isDobKnown =
    propsFromParent.values.isDobKnown === undefined
      ? undefined
      : propsFromParent.values.isDobKnown === "true";

  const setError = React.useCallback(
    (field: PluginField, value: string, error: string) => {
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
    []
  );

  React.useEffect(() => {
    if (!isDobKnown) {
      return;
    }

    const inputDateOfBirth = propsFromParent.values.dateOfBirth;
    const formattedDateOfBirth = formatDate(inputDateOfBirth);
    if (inputDateOfBirth) {
      if (!formattedDateOfBirth) {
        setError(
          PluginFields.dateOfBirth,
          inputDateOfBirth,
          i18n.t("Invalid date format, please use YYYY-MM-DD or YYYYMMDD")
        );
      } else if (
        new Date(formattedDateOfBirth).getTime() > new Date().getTime()
      ) {
        setError(
          PluginFields.dateOfBirth,
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
  }, [propsFromParent.values.dateOfBirth, isDobKnown]);

  React.useEffect(() => {
    if (isDobKnown === undefined || isDobKnown === true) {
      return;
    }
    const age = parseInt(propsFromParent.values.age);
    if ((propsFromParent.values.age !== undefined && isNaN(age)) || age < 0) {
      setError(
        PluginFields.age,
        propsFromParent.values.age,
        i18n.t("Age must be a valid positive integer number")
      );
      return;
    }
    const calculatedDob = calculateDob(age);
    propsFromParent.setFieldValue({
      fieldId: PluginFields.dateOfBirth,
      value: calculatedDob.toISOString().split("T")[0], // format to YYYY-MM-DD
      options: {
        valid: true,
        touched: true,
      },
    });
  }, [propsFromParent.values.age, isDobKnown]);
  return <div></div>;
};

export default PluginInner;
