const shadow = require("./shadow.js"); // shadow package

const API_KEY = ""; // use /apikey
const SCRIPT_ID = ""; // your script id
const KEY_STATUS = ""; // free, paid, or paidplus

async function generateKey(apiKey, scriptId, status) {
    let table = {
        scriptId: scriptId,
        apiKey: apiKey,
        status: status,
    }

    table = JSON.stringify(table);
    table = shadow.encode(table);

    const res = await fetch(`http://mewo.lol:6969/api/v2/dev/key?encoded=${table}`);
    return res.text();
}

console.log(atob(await generateKey(API_KEY, SCRIPT_ID, KEY_STATUS))); // outputs a valid key
