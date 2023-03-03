// schema builder
import { string, number, array, object, lazy } from "yup";

// libphonenumber-js
import parsePhoneNumberFromString from "libphonenumber-js";

// Lodash helpers
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

// http
import axios from "./axios";

/**
 * Required field validation schema builder.
 *
 * @param {String} value
 * @param {object} rules
 * @param {object} values
 *
 * @return {String|undefined}
 */
const validateFormInput = async (value, rules, values) => {
  let error;

  let schema = string();

  if (get(rules, "positiveNumber", false)) {
    schema = number(rules.positiveNumber.error)
      .positive(rules.positiveNumber.error)
      .nullable()
      .required(rules.positiveNumber.error);
  }

  if (get(rules, "inclusivePositiveNumber", false)) {
    schema = number(rules.inclusivePositiveNumber.error).min(
      0,
      rules.inclusivePositiveNumber.error
    );
  }

  if (get(rules, "requiredSelect", false)) {
    schema = object()
      .shape({
        id: lazy((value) =>
          Number.isInteger(value)
            ? number(rules.requiredSelect.error)
                .integer(rules.requiredSelect.error)
                .required(rules.requiredSelect.error)
            : string(rules.requiredSelect.error).required(rules.requiredSelect.error)
        ),
        label: string(rules.requiredSelect.error).required(rules.requiredSelect.error),
      })
      .nullable()
      .required(rules.requiredSelect.error);

    // schema = schema.test('required-select', rules.requiredSelect.error, function (value) {
    //     if (!isObject(value)) {
    //         return false;
    //     }

    //     return true;
    // });

    // schema = object().shape({
    //     id: lazy((value) =>
    //         Number.isInteger(value)
    //             ? number(rules.requiredSelect.error)
    //                   .integer(rules.requiredSelect.error)
    //                   .required(rules.requiredSelect.error)
    //             : string(rules.requiredSelect.error).required(rules.requiredSelect.error)
    //     ),
    //     label: string(rules.requiredSelect.error).required(rules.requiredSelect.error),
    // });
  }

  if (get(rules, "multipleSelect", false)) {
    schema = array().of(
      object().shape({
        id: lazy((value) =>
          Number.isInteger(value)
            ? number(rules.multipleSelect.error)
                .integer(rules.multipleSelect.error)
                .required(rules.multipleSelect.error)
            : string(rules.multipleSelect.error).required(rules.multipleSelect.error)
        ),
        label: string(rules.multipleSelect.error).required(rules.multipleSelect.error),
      })
    );
  }

  if (get(rules, "nullableSelect", false)) {
    schema = object()
      .shape({
        id: lazy((value) =>
          Number.isInteger(value)
            ? number(rules.nullableSelect.error)
                .integer(rules.nullableSelect.error)
                .nullable()
                .required(rules.nullableSelect.error)
            : string(rules.nullableSelect.error).nullable().required(rules.nullableSelect.error)
        ),
        label: string(rules.nullableSelect.error).nullable().required(rules.nullableSelect.error),
      })
      .nullable();
  }

  if (get(rules, "selectSingle", false)) {
    schema = object().shape({
      value: lazy((value) => {
        return Number.isInteger(value)
          ? number(rules.selectSingle.error)
              .integer(rules.selectSingle.error)
              .required(rules.selectSingle.error)
          : string(rules.selectSingle.error).required(rules.selectSingle.error);
      }),
      label: string(rules.selectSingle.error).required(rules.selectSingle.error),
    });
  }

  if (get(rules, "selectSingleNullable", false)) {
    schema = object().shape({
      value: number(rules.selectSingleNullable.error)
        .integer(rules.selectSingleNullable.error)
        .nullable(),
      label: string(rules.selectSingleNullable.error).nullable(),
    });
  }

  if (get(rules, "selectMultiple", false)) {
    schema = array().of(
      object().shape({
        value: number(rules.selectMultiple.error)
          .integer(rules.selectMultiple.error)
          .required(rules.selectMultiple.error),
        label: string(rules.selectMultiple.error).required(rules.selectMultiple.error),
      })
    );
  }

  if (get(rules, "required", false)) {
    schema = schema.required(rules.required.error);
  }

  if (get(rules, "min", false)) {
    schema = schema.min(rules.min.length, rules.min.error);
  }

  if (get(rules, "max", false)) {
    schema = schema.max(rules.max.length, rules.max.error);
  }

  if (get(rules, "email", false)) {
    schema = schema.email(rules.email.error);
  }

  if (get(rules, "passwordConfirmation", false)) {
    schema = schema.test("passwords-match", rules.passwordConfirmation.error, function (value) {
      return get(values, "password", null) === value;
    });
  }

  if (get(rules, "nullable", false)) {
    schema = schema.nullable();
  }

  if (get(rules, "remotelyUnique", false)) {
    schema = schema.test("remotely-unique", rules.remotelyUnique.error, async function (value) {
      try {
        const fixedPhoneNumber = value.replaceAll("+", "");

        const response = await axios.post(rules.remotelyUnique.url, {
          field: `+${fixedPhoneNumber}`,
        });

        return response.data;
      } catch (e) {
        return false;
      }
    });
  }

  try {
    await schema.validate(value, {
      abortEarly: true,
    });

    if (get(rules, "phone", false)) {
      const fixedPhoneNumber = value.replaceAll("+", "");

      const phoneNumber = await parsePhoneNumberFromString(`+${fixedPhoneNumber}`);

      if (isEmpty(phoneNumber) || !phoneNumber.isValid()) {
        error = rules.phone.error;
      }
    }
  } catch (err) {
    error = err.errors[0];
  }

  return error;
};

export default validateFormInput;
