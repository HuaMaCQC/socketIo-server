
const fs = require('fs');

const json = JSON.parse(fs.readFileSync(__dirname + '/src/locales/zh-tw.json').toString());
const res = {};
const deep = (o, keys = []) => {

    const oks = Object.keys(o);
    console.info(JSON.stringify(o), oks, keys);
    oks.forEach(k => {
        if (typeof o[k] === 'string') {
            res[([...keys, k]).join('.')] = o[k];
        } else {
            deep(o[k], [...keys, k]);
        }
    });
}

deep(json);
fs.writeFileSync(__dirname + '/dist/locales/zh-tw.json', JSON.stringify(res));