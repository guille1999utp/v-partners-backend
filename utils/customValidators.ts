import { body, param } from "express-validator";

const fieldValidation = (fieldName: string, allowedValues: string[]) => {
    return (value: any) => {
        if (!allowedValues.includes(value.toUpperCase())) {
            throw new Error(`El campo ${fieldName} solo puede tener los valores ${allowedValues.join(' o ')}`);
        }
        return true;
    };
};


export const statusValidation = body('status').custom(fieldValidation('status', ['OPEN', 'CLOSE']))

export const idValidation = [
    param('id')
        .notEmpty().withMessage('El parámetro id es obligatorio')
        .isInt().withMessage('El parámetro id debe ser un número entero')
        .toInt()
];
