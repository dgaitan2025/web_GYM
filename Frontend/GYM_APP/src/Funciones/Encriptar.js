import CryptoJS from "crypto-js";

const valorx = "margin-top-padding-bottom-BT";

export function encryptString(plain) {
  return CryptoJS.AES.encrypt(String(plain), valorx ).toString();
}


export function decryptString(cipher) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, valorx );
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
}