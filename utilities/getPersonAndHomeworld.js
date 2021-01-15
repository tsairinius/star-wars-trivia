import { getRandomPersonWithProps } from "./getRandomPersonWithProps.js";
import * as utils from "./utilities.js";
import { validateProperties } from "./validateProperties.js";

export async function getPersonAndHomeworld() {
    let homeworld = null;
    let randomPerson;
    for (let i = 0; i < 3; i++) {
        randomPerson = await getRandomPersonWithProps(["name", "homeworld"]);
        homeworld = await utils.fetchItem(randomPerson.homeworld);
        if (validateProperties(homeworld, ["name"])) {
            break;
        } 
    }

    if (!validateProperties(homeworld, ["name"])) {
        throw new Error("After multiple attempts, a person with a valid homeworld could not be retrieved");
    }

    return {
        person: randomPerson.name,
        homeworld: homeworld.name
    }
}