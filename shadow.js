/*
 * * * * * * * * * * * * * * * * * * * * * 
 * SHADOW v1.2
 * Random utilities for my code
 * Made for Stardust by TeamAstral
 * Developed by at4pm
 * Last updated: 2-08-24
 * * * * * * * * * * * * * * * * * * * * *
*/

const { randomBytes } = require("crypto");
const lua = require("luaparse");

// express middleware
function restrict(req, res, next) {
    const userAgent = req.get("User-Agent").toLowerCase();

    if (!userAgent.includes("roblox")) {
        res.status(403).send("Web clients are not allowed to make API requests.");
        return;
    } else {
        next();
    }
}

// encryption, encoding 
function encode(str) {
    let base64Table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let encoded = "";
    let utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function(match, p1) {
            return String.fromCharCode('0x' + p1);
        }
    );

    for (let i = 0; i < utf8Bytes.length; i += 3) {
        let byte1 = utf8Bytes.charCodeAt(i);
        let byte2 = utf8Bytes.charCodeAt(i + 1);
        let byte3 = utf8Bytes.charCodeAt(i + 2);

        let enc1 = byte1 >> 2;
        let enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
        let enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
        let enc4 = byte3 & 63;

        if (isNaN(byte2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(byte3)) {
            enc4 = 64;
        }

        encoded += base64Table.charAt(enc1) + base64Table.charAt(enc2) +
            base64Table.charAt(enc3) + base64Table.charAt(enc4);
    }

    return encoded;
}

function encrypt(message, key) {
    let keyBytes = Array.from(key, c => c.charCodeAt(0));
    let messageBytes = Array.from(message, c => c.charCodeAt(0));
    let encryptedBytes = messageBytes.map((byte, index) => byte ^ keyBytes[index % keyBytes.length]);
    let encryptedMessage = String.fromCharCode(...encryptedBytes);
    return encryptedMessage;
}

// random shit
function generate() {
    return randomBytes(12)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, 12);
}

function validate(script) {
    try {
        lua.parse(script, {
            luaVersion: "5.1",
            locations: true,
            comments: true,
            extendedIdentifiers: true,
            ranges: true,
        });
        return true;
    } catch (_e) {
        return false;
    }
}

module.exports = {
    restrict: restrict,
    encrypt: encrypt,
    encode: encode,
    generate: generate,
    validate: validate,
}
