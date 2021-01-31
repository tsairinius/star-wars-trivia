import { getRandomPersonWithProps } from "./getRandomPersonWithProps.js";
import * as utils from "./utilities.js";
import { validateProperties } from "./validateProperties.js";

export async function getPersonAndProperty(propName) {
    if (typeof propName !== "string") {
        throw new TypeError(`Invalid argument: ${propName}. Must be of type string.`)
    };

    let property = null;
    let randomPerson;
    for (let i = 0; i < 3; i++) {
        randomPerson = await getRandomPersonWithProps(["name", propName]);

        if (!randomPerson[propName]) {
            throw new Error(`The following person object does not possess property ${propName}: ${randomPerson ? JSON.stringify(randomPerson) : randomPerson}`);
        }

        let propertyEndpoint;
        if (Array.isArray(randomPerson[propName])) {
            if (randomPerson[propName].length !== 1) {
                throw new Error(`Specified property '${propName}' of ${randomPerson.name} contains ${randomPerson[propName].length} elements. We only handle properties containing a single element`);
            }
            else {
                propertyEndpoint = randomPerson[propName][0];
            }
        }
        else {
            propertyEndpoint = randomPerson[propName];
        }

        property = await utils.fetchItem(propertyEndpoint);

        if (validateProperties(property, ["name"])) {
            break;
        } 
    }

    if (!validateProperties(property, ["name"])) {
        throw new Error(`After multiple attempts, a person with a valid ${propName} could not be retrieved`);
    }

    return {
        person: randomPerson.name,
        [propName]: property.name
    }
}