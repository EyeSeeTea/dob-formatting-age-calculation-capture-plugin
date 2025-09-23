import "./index.css";
import React from "react";
import { IDataEntryPluginProps, PluginFields } from "./Plugin.types";
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
import { useSetField } from "./hooks/useSetField";
import { calculateAgeInMonths } from "./utils/calculateAgeInMonths";
import usePrevious from "./hooks/usePrevious";
import { hasSameAge } from "./utils/hasSameAge";

const MAX_AGE = 125; // Maximum age allowed
const MIN_DOB = new Date("1900-01-01").getTime(); // Minimum date of birth allowed
const MAX_CALC_AGE_IN_MONTHS_YEARS = 5; // Maximum age in years to calculate age in months

const PluginInner = (propsFromParent: IDataEntryPluginProps) => {
  const { isDobKnown, age, dateOfBirth, ageInMonths } =
    propsFromParent.values as {
      isDobKnown?: "true" | "false" | undefined;
      age?: string;
      dateOfBirth?: string;
      ageInMonths?: string;
    };

  const setError = useSetError(propsFromParent);

  const setAge = useSetField<string>(propsFromParent, PluginFields.age);
  const setDob = useSetField<string>(propsFromParent, PluginFields.dateOfBirth);
  const setAgeInMonths = useSetField<string>(
    propsFromParent,
    PluginFields.ageInMonths
  );

  const previousAge = usePrevious(age);
  const previousAgeInMonths = usePrevious(ageInMonths);
  const previousDateOfBirth = usePrevious(dateOfBirth);

  useEffectAfterMount(() => {
    // reset age, ageInMonths and dateOfBirth when isDobKnown is undefined
    if (isDobKnown === undefined) {
      setDob(undefined);
      setAge(undefined);
      setAgeInMonths(undefined);
    }
  }, [isDobKnown, setAge, setAgeInMonths, setDob]);

  React.useEffect(() => {
    // handle changes in dateOfBirth when isDobKnown is true
    if (isDobKnown === undefined || isDobKnown === "false") {
      return;
    }
    if (!dateOfBirth || dateOfBirth === previousDateOfBirth) {
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
      setDob(formattedDateOfBirth);
      const ageCalculated = calculateAge(formattedDateOfBirth);
      // setting an integer as value seems to cause an error
      setAge(ageCalculated + "");
      if (ageCalculated <= MAX_CALC_AGE_IN_MONTHS_YEARS) {
        setAgeInMonths(calculateAgeInMonths(formattedDateOfBirth) + "");
      } else {
        setAgeInMonths("");
      }
    }
  }, [dateOfBirth, isDobKnown, setError, setDob, setAge, setAgeInMonths]);

  React.useEffect(() => {
    // handle changes in age when isDobKnown is false
    if (isDobKnown === undefined || isDobKnown === "true") {
      return;
    }
    if (age === undefined || age === previousAge) {
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
      const formattedEstimatedDob = dateToString(calculateDob(ageParsed));
      setDob(formattedEstimatedDob);
      if (ageParsed <= MAX_CALC_AGE_IN_MONTHS_YEARS) {
        if (
          !ageInMonths ||
          !hasSameAge(
            formattedEstimatedDob,
            dateToString(calculateDobFromAgeInMonths(parseInt(ageInMonths)))
          )
        ) {
          // only set if needed, prefer existing ageInMonths if same age for more granularity
          setAgeInMonths(calculateAgeInMonths(formattedEstimatedDob) + "");
        }
      } else {
        setAgeInMonths("");
      }
    }
  }, [age, ageInMonths, isDobKnown, setError, setDob, setAgeInMonths]);

  React.useEffect(() => {
    // handle changes in ageInMonths when isDobKnown is false
    if (isDobKnown === undefined || isDobKnown === "true") {
      return;
    }
    if (ageInMonths === undefined || ageInMonths === previousAgeInMonths) {
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
      setDob(formattedEstimatedDob);
      setAge(calculateAge(formattedEstimatedDob) + "");
    }
  }, [ageInMonths, isDobKnown, setError, setDob, setAge]);

  return <div></div>;
};

export default PluginInner;
