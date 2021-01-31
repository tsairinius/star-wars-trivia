export function validateProperties(item, props = []) {
    if (!Array.isArray(props)) {
        throw new TypeError("First argument should be an object and the second an array of properties (eg: 'name', 'birth_year') in string representation");
    }

    let isValid = true;
    if (!item) {
        isValid = false;
    }
    else {
        isValid = !props.some(prop => !item[prop] || item[prop] === "unknown");
    }

    return isValid;
}