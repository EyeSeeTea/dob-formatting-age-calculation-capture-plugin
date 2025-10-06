import "./index.css";
import React from "react";
import {
  IDataEntryPluginProps,
  PluginFields,
  PluginValues,
} from "./Plugin.types";
import { formatDate } from "./utils/formatDate";
import i18n from "@dhis2/d2-i18n";
import { calculateAge } from "./utils/calculateAge";
import {
  calculateDob,
  calculateDobFromAgeInMonths,
} from "./utils/calculateDob";
import { dateToString } from "./utils/dateToString";
import { useSetError } from "./hooks/useSetError";
import { useEffectAfterMount } from "./hooks/useEffectAfterMount";
import { calculateAgeInMonths } from "./utils/calculateAgeInMonths";
import usePrevious from "./hooks/usePrevious";
import { hasSameAge } from "./utils/hasSameAge";
import { useSetFields } from "./hooks/useSetFields";

const MAX_AGE = 125; // Maximum age allowed
const MIN_DOB = new Date("1900-01-01").getTime(); // Minimum date of birth allowed
const MAX_CALC_AGE_IN_MONTHS_YEARS = 5; // Maximum age in years to calculate age in months

const PluginInner = (propsFromParent: IDataEntryPluginProps) => {
  const { isDobKnown, age, dateOfBirth, ageInMonths } =
    propsFromParent.values as PluginValues;
  const setError = useSetError(propsFromParent);

  const { pluginState, setFields } = useSetFields(
    propsFromParent.setFieldValue
  );

  const previousAge = usePrevious(age);
  const previousAgeInMonths = usePrevious(ageInMonths);
  const previousDateOfBirth = usePrevious(dateOfBirth);

  useEffectAfterMount(() => {
    // reset age, ageInMonths and dateOfBirth when isDobKnown is undefined
    if (isDobKnown === undefined) {
      setFields({
        [PluginFields.age]: undefined,
        [PluginFields.ageInMonths]: undefined,
        [PluginFields.dateOfBirth]: undefined,
      });
    }
  }, [isDobKnown, setFields]);

  React.useEffect(() => {
    // handle changes in dateOfBirth when isDobKnown is true
    if (isDobKnown === undefined || isDobKnown === "false") {
      return setFields({
        [PluginFields.dateOfBirth]: pluginState.current.dateOfBirth,
      });
    }
    if (
      !dateOfBirth ||
      dateOfBirth === pluginState.current.dateOfBirth ||
      dateOfBirth === previousDateOfBirth
    ) {
      return;
    }
    const formattedDateOfBirth = formatDate(dateOfBirth);
    if (!formattedDateOfBirth) {
      setError(
        PluginFields.dateOfBirth,
        dateOfBirth,
        i18n.t(
          "Invalid date. Please use format YYYY-MM-DD or YYYYMMDD and ensure the date exists and is valid"
        )
      );
    } else if (
      new Date(formattedDateOfBirth).getTime() > new Date().getTime()
    ) {
      setError(
        PluginFields.dateOfBirth,
        dateOfBirth,
        i18n.t("Date of Birth cannot be in the future")
      );
    } else if (new Date(formattedDateOfBirth).getTime() < MIN_DOB) {
      setError(
        PluginFields.dateOfBirth,
        dateOfBirth,
        i18n.t("Date of Birth cannot be previous to 1900-01-01")
      );
    } else {
      const ageCalculated = calculateAge(formattedDateOfBirth);
      const calculatedAgeInMonths =
        ageCalculated <= MAX_CALC_AGE_IN_MONTHS_YEARS
          ? calculateAgeInMonths(formattedDateOfBirth)
          : "";
      setFields({
        [PluginFields.age]: ageCalculated + "",
        [PluginFields.ageInMonths]: calculatedAgeInMonths + "",
        [PluginFields.dateOfBirth]: formattedDateOfBirth,
      });
    }
  }, [dateOfBirth, setError, setFields]);

  React.useEffect(() => {
    // handle changes in age when isDobKnown is false
    if (isDobKnown === undefined || isDobKnown === "true") {
      return setFields({
        [PluginFields.age]: pluginState.current.age,
      });
    }
    if (
      age === undefined ||
      age === pluginState.current.age ||
      age === previousAge
    ) {
      return;
    }
    const ageParsed = parseInt(age);
    if ((ageParsed !== undefined && isNaN(ageParsed)) || ageParsed < 0) {
      setError(
        PluginFields.age,
        age,
        i18n.t("Age must be a valid positive integer number")
      );
    } else if (ageParsed > MAX_AGE) {
      setError(PluginFields.age, age, i18n.t("Age cannot be greater than 125"));
    } else {
      const sameAgeAsDob =
        dateOfBirth !== undefined &&
        ageParsed !== undefined &&
        hasSameAge(dateOfBirth, dateToString(calculateDob(ageParsed)));
      const formattedEstimatedDob = sameAgeAsDob
        ? dateOfBirth
        : dateToString(calculateDob(ageParsed));
      const calculatedAgeInMonths =
        ageParsed <= MAX_CALC_AGE_IN_MONTHS_YEARS
          ? calculateAgeInMonths(formattedEstimatedDob)
          : "";
      setFields({
        [PluginFields.dateOfBirth]: formattedEstimatedDob,
        [PluginFields.ageInMonths]: calculatedAgeInMonths + "",
        [PluginFields.age]: ageParsed + "",
      });
    }
  }, [age, ageInMonths, setError, setFields]);

  React.useEffect(() => {
    // handle changes in ageInMonths when isDobKnown is false
    if (isDobKnown === undefined || isDobKnown === "true") {
      return setFields({
        [PluginFields.ageInMonths]: pluginState.current.ageInMonths,
      });
    }
    if (
      ageInMonths === undefined ||
      ageInMonths === pluginState.current.ageInMonths ||
      ageInMonths === previousAgeInMonths
    ) {
      return;
    }
    const ageInMonthsParsed = parseInt(ageInMonths);
    if (
      (ageInMonthsParsed !== undefined && isNaN(ageInMonthsParsed)) ||
      ageInMonthsParsed < 0
    ) {
      setError(
        PluginFields.age,
        ageInMonths,
        i18n.t("Age in months must be a valid positive integer number")
      );
    } else {
      const formattedEstimatedDob = dateToString(
        calculateDobFromAgeInMonths(ageInMonthsParsed)
      );
      setFields({
        [PluginFields.dateOfBirth]: formattedEstimatedDob,
        [PluginFields.age]: calculateAge(formattedEstimatedDob) + "",
        [PluginFields.ageInMonths]: ageInMonthsParsed + "",
      });
    }
  }, [ageInMonths, setError, setFields]);

  return <div></div>;
};

export default PluginInner;
