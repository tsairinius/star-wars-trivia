export function isPositiveInteger(number) {
    return Number.isInteger(number) && number > 0;
};

export function isWholeNumber(number) {
    return Number.isInteger(number) && number >= 0;
};