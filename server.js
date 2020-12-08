const express = require('express');
const path = require('path');
const open = require('open');
const app = express();
const port = 8000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./index.html"));
});

app.listen(port, (error) => {
    if (error) {
        console.log(error);
    }
    else {
        open(`http://localhost:${port}`)
    }
})
