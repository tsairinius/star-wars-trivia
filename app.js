

fetch('https://swapi.dev/api/planets/1/')
    .then(res => res.json())
    .then(json => document.querySelector('p').appendChild(document.createTextNode(json.name)))


