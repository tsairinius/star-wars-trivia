export function isPercentage(value) {
    return (typeof value === "number" && value <= 100 && value >= 0);
};