import React from 'react';

export default class HexHelper {
    static genHexString(len) {
        const hex = '0123456789ABCDEF';
        let output = '';
        for (let i = 0; i < len; ++i) {
            output += hex.charAt(Math.floor(Math.random() * hex.length));
        }
        return output;
    }

    static hexStringToByteArray(hexStr) {
        var bytes = [];
        while (hexStr.length >= 2) {
            bytes.push(parseInt(hexStr.substring(0, 2), 16));
            hexStr = hexStr.substring(2, hexStr.length);
        }
        return new Uint8Array(bytes);
    }
}