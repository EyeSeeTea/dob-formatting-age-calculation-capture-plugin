import "./index.css";
import React from "react";
import { IDataEntryPluginProps, PluginFields } from "./Plugin.types";
import { formatDate } from "./utils/formatDate";
import i18n from "@dhis2/d2-i18n";
import { calculateAge } from "./utils/calculateAge";
import { calculateDob } from "./utils/calculateDob";
import { dateToString } from "./utils/dateToString";
import { useSetError } from "./hooks/useSetError";
import { useEffectAfterMount } from "./hooks/useEffectAfterMount";
import { useSetField } from "./hooks/useSetField";
import { calculateAgeInMonths } from "./utils/calculateAgeInMonths";

const MAX_AGE = 125; // Maximum age allowed
const MIN_DOB = new Date("1900-01-01").getTime(); // Minimum date of birth allowed

const PluginInner = (propsFromParent: IDataEntryPluginProps) => {
  const { isDobKnown, age, dateOfBirth } = propsFromParent.values as {
    isDobKnown?: "true" | "false" | undefined;
    age?: string;
    dateOfBirth?: string;
  };

  const setError = useSetError(propsFromParent);

  const setAge = useSetField<string>(propsFromParent, PluginFields.age);
  const setDob = useSetField<string>(propsFromParent, PluginFields.dateOfBirth);
  const setAgeInMonths = useSetField<string>(
    propsFromParent,
    PluginFields.ageInMonths
  );

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
    if (!dateOfBirth) {
      return;
    }
    const formattedDateOfBirth = formatDate(dateOfBirth);
    if (!formattedDateOfBirth) {
      setError(
        PluginFields.dateOfBirth,
        dateOfBirth,
        i18n.t("Invalid date format, please use YYYY-MM-DD or YYYYMMDD")
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
      // setting an integer as value seems to cause an error
      setAge(calculateAge(formattedDateOfBirth) + "");
      setAgeInMonths(calculateAgeInMonths(formattedDateOfBirth) + "");
    }
  }, [dateOfBirth, isDobKnown, setError, setDob, setAge, setAgeInMonths]);

  React.useEffect(() => {
    // handle changes in age when isDobKnown is false
    if (isDobKnown === undefined || isDobKnown === "true") {
      return;
    }
    if (age === undefined) {
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
      const calculatedDob = calculateDob(ageParsed);
      setDob(dateToString(calculatedDob));
    }
  }, [age, isDobKnown, setError, setDob]);

  return <div></div>;
};

export default PluginInner;
