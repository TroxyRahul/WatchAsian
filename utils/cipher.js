import CryptoJS from "crypto-js";
import config from "../config.js";

const KEY = CryptoJS.enc.Utf8.parse(config.ENCRYPTION.KEY);

const IV = CryptoJS.enc.Utf8.parse(config.ENCRYPTION.IV);

export const encode = (str) => {
    const encoded = btoa(str);
    return encoded.replace(/=/g, "");
}

export const decode = (str) => {
    return  atob(str);
}

export const decrypt = (encString) => {
    const bytes = CryptoJS.AES.decrypt(encString, KEY, { iv: IV });
    return bytes.toString(CryptoJS.enc.Utf8);
}

export const encrypt = (text) => {
    const bytes = CryptoJS.AES.encrypt(text, KEY, { iv: IV });
    return bytes.toString();
}