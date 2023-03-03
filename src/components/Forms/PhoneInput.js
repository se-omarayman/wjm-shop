import PropTypes from 'prop-types';
import { Fragment } from 'react';

// @mui
import { FormHelperText } from '@mui/material';
// phone input
import OriginalPhoneInput from 'react-phone-input-2';
// lodash
import get from 'lodash/get';
// redux
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

function PhoneInput({
    input,
    disabled,
    meta,
    touched,
    errors,
    hasUnprocessableEntities,
    noErrorHelperText,
}) {
    const notifications = useSelector((state) => state.notifications);

    return (
        <Fragment>
            <OriginalPhoneInput
                {...input}
                country="sa"
                autoFormat={true}
                enableSearch={true}
                autocompleteSearch={false}
                countryCodeEditable={false}
                style={{ direction: 'ltr' }}
                disabled={disabled || false}
                searchPlaceholder="Search..."
                searchNotFound="No entries to show"
                inputProps={{
                    name: input.name,
                    autoComplete: 'off',
                }}
                inputStyle={{
                    width: '100%',
                    height: '53.1px',
                    color:
                        (!disabled && meta.error && meta.touched) ||
                        (!disabled &&
                            !(get(errors, input.name, false) && get(touched, input.name, false)) &&
                            hasUnprocessableEntities &&
                            get(notifications.api.error, `data.errors.${input.name}[0]`, false))
                            ? '#FF4842'
                            : '#212B36',
                    backgroundColor:
                        (!disabled && meta.error && meta.touched) ||
                        (!disabled &&
                            !(get(errors, input.name, false) && get(touched, input.name, false)) &&
                            hasUnprocessableEntities &&
                            get(notifications.api.error, `data.errors.${input.name}[0]`, false))
                            ? 'rgba(255, 72, 66, 0.08)'
                            : 'rgba(145, 158, 171, 0.08)',
                    borderRadius: '8px',
                }}
            />

            {!noErrorHelperText && (
                <FormHelperText
                    sx={{ px: '14px' }}
                    error={Boolean(
                        (!disabled && meta.error && meta.touched) ||
                            (!disabled &&
                                !(
                                    get(errors, input.name, false) &&
                                    get(touched, input.name, false)
                                ) &&
                                hasUnprocessableEntities &&
                                get(notifications.api.error, `data.errors.${input.name}[0]`, false))
                    )}
                >
                    {!(get(errors, input.name, false) && get(touched, input.name, false)) &&
                    hasUnprocessableEntities &&
                    get(notifications.api.error, `data.errors.${input.name}[0]`, false)
                        ? get(notifications.api.error, `data.errors.${input.name}[0]`, '')
                        : null}
                    {get(errors, input.name, false) && get(touched, input.name, false)
                        ? get(errors, input.name, '')
                        : null}
                </FormHelperText>
            )}
        </Fragment>
    );
}

PhoneInput.propTypes = {
    input: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    meta: PropTypes.object,
    touched: PropTypes.object,
    errors: PropTypes.object,
    hasUnprocessableEntities: PropTypes.bool,
    noErrorHelperText: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default PhoneInput;
