export function computePercentage(dividend, divisor) {
    if (typeof dividend !== "number" || typeof divisor !== "number") {
        throw new TypeError(`Invalid arguments. Both arguments must be numbers. dividend: ${dividend}, divisor: ${divisor}`);
    };

    if (divisor <= 0) {
        throw new Error(`Divisor must be a number greater than 0. divisor: ${divisor}`);
    }

    return Math.max(100*(dividend/divisor), 0);
}