import clsx from 'clsx';
import { UseFormRegisterReturn } from 'react-hook-form';

import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

type TextAreaFieldProps = FieldWrapperPassThroughProps & {
    className?: string;
    placeholder?: string;
    registration: Partial<UseFormRegisterReturn>;
    rows?: number;
};

export const TextAreaField = (props: TextAreaFieldProps) => {
    const { label, className, registration, error, placeholder, rows = 3 } = props;
    return (
        <FieldWrapper label={label} error={error}>
            <textarea
                className={clsx('form-control', error?.message && 'is-invalid', className)}
                placeholder={placeholder ?? label}
                rows={rows}
                {...registration}
            />
        </FieldWrapper>
    );
};
