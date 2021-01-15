export function validateProperties(person, props = []) {
    if (!Array.isArray(props)) {
        throw new TypeError("First argument should be a person object and the second an array of properties (eg: 'name', 'birth_year') in string representation");
    }

    let isValid = true;
    if (!person) {
        isValid = false;
    }
    else {
        isValid = !props.some(prop => !person[prop] || person[prop] === "unknown");
    }

    return isValid;
}