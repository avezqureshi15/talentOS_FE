import { useCallback, useState } from "react";
import {
  CREATE_HR_ERRORS,
  CREATE_HR_FIELDS,
  INITIAL_CREATE_HR_VALUES,
} from "./create-hiring-request-modal.constants";
import type {
  CreateHiringRequestFormErrors,
  CreateHiringRequestFormValues,
  CreateHiringRequestStep,
  HiringRequestCreatePayload,
} from "./create-hiring-request-modal.types";
import { parseListField } from "./parse-list-field";

function requiredError(value: string): string | undefined {
  return value.trim() ? undefined : CREATE_HR_ERRORS.REQUIRED;
}

function maxLengthError(value: string, max: number): string | undefined {
  return value.trim().length > max ? CREATE_HR_ERRORS.MAX_LENGTH(max) : undefined;
}

export function useCreateHiringRequestForm() {
  const [values, setValues] = useState<CreateHiringRequestFormValues>({ ...INITIAL_CREATE_HR_VALUES });
  const [errors, setErrors] = useState<CreateHiringRequestFormErrors>({});

  const setField = useCallback(
    <K extends keyof CreateHiringRequestFormValues>(key: K, value: CreateHiringRequestFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key as keyof CreateHiringRequestFormErrors];
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => {
    setValues({ ...INITIAL_CREATE_HR_VALUES, location: [] });
    setErrors({});
  }, []);

  const validate = useCallback(
    (step: CreateHiringRequestStep): boolean => {
      const next: CreateHiringRequestFormErrors = {};

      if (step === 1) {
        const titleReq = requiredError(values.title);
        const titleMax = maxLengthError(values.title, CREATE_HR_FIELDS.title.maxLength);
        if (titleReq) next.title = titleReq;
        else if (titleMax) next.title = titleMax;

        const deptReq = requiredError(values.department);
        const deptMax = maxLengthError(values.department, CREATE_HR_FIELDS.department.maxLength);
        if (deptReq) next.department = deptReq;
        else if (deptMax) next.department = deptMax;

        if (values.location.length === 0) {
          next.location = CREATE_HR_ERRORS.REQUIRED;
        } else {
          const tooLong = values.location.find(
            (loc) => loc.trim().length > CREATE_HR_FIELDS.location.maxLength,
          );
          if (tooLong) {
            next.location = CREATE_HR_ERRORS.LOCATION_ITEM_MAX(CREATE_HR_FIELDS.location.maxLength);
          }
        }

        const typeReq = requiredError(values.type);
        const typeMax = maxLengthError(values.type, CREATE_HR_FIELDS.type.maxLength);
        if (typeReq) next.type = typeReq;
        else if (typeMax) next.type = typeMax;

        const descReq = requiredError(values.description);
        if (descReq) next.description = descReq;
      }

      if (step === 2) {
        if (parseListField(values.requirements).length === 0) {
          next.requirements = CREATE_HR_ERRORS.REQUIRED;
        }

        const criteriaReq = requiredError(values.custom_evaluation_criteria);
        if (criteriaReq) next.custom_evaluation_criteria = criteriaReq;
      }

      setErrors(next);
      return Object.keys(next).length === 0;
    },
    [values],
  );

  const toPayload = useCallback((): HiringRequestCreatePayload => {
    const requirements = parseListField(values.requirements);
    const benefits = parseListField(values.benefits);
    const criteria = values.custom_evaluation_criteria.trim();

    return {
      title: values.title.trim(),
      department: values.department.trim(),
      location: values.location.map((loc) => loc.trim()).filter(Boolean),
      type: values.type.trim(),
      description: values.description.trim(),
      requirements,
      benefits,
      custom_evaluation_criteria: criteria || null,
      is_active: values.is_active,
    };
  }, [values]);

  return { values, errors, setField, reset, validate, toPayload };
}
