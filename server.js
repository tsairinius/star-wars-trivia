import express from 'express';
import path from 'path';
import open from 'open';

const app = express();
const port = 8000;

const __dirname = path.resolve();

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
