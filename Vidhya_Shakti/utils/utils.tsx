import CryptoJS from 'crypto-js'
import { HttpService } from '../_services/httpservices';

const environment = require('../environments/environment')

export class Utils {
  public hexToShort(hex: string) {
    return parseInt(hex, 16);
  }

  public randomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKL$@#!MNOPQRSTUVWXYZ$@#!abcde$@#!fghijklmnopqrstuvwxyz0123456789$@#!';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  noAuthEncrypt(val: any) {
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(val.toString()), environment.environment.keyEncryptDecrypt, { keySize: 128 / 8, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
  }

  noAuthDecrypt(encryptedData: string) {
    var decryptedBytes = CryptoJS.AES.decrypt(encryptedData, environment.environment.keyEncryptDecrypt, {
      keySize: 128 / 8,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    var decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedText;
  }
  encrypt(val: any) {
    let eKey = HttpService.keyEncryptDecrypt;
    let startNumber = this.hexToShort(eKey.substring(eKey.length - 2));
    var key = CryptoJS.enc.Utf8.parse(eKey.substring(startNumber, startNumber + 32));
    var iv = CryptoJS.enc.Hex.parse(this.randomString(32));
    var encrypted = CryptoJS.AES.encrypt(val, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC
    });
    var output = encrypted.ciphertext.toString();
    return iv + ":" + output;
  }

  decrypt(val: any) {
    try {
      let dKey = HttpService.keyEncryptDecrypt;
      let startNumber = this.hexToShort(dKey.substring(dKey.length - 2));
      const key = CryptoJS.enc.Utf8.parse(HttpService.keyEncryptDecrypt.substring(startNumber, startNumber + 32));
      const keyVal = val.split(":");
      const iv = CryptoJS.enc.Hex.parse(keyVal[0]);
      const cipherText = CryptoJS.enc.Hex.parse(keyVal[1]);
      const options = { mode: CryptoJS.mode.CBC, iv: iv };
      const cipherParams: CryptoJS.lib.CipherParams | any = { ciphertext: cipherText, iv: iv, salt: undefined }; // Use CryptoJS.lib.CipherParams
      const decrypted = CryptoJS.AES.decrypt(cipherParams, key, options);
      const retVal = decrypted.toString(CryptoJS.enc.Utf8);
      return retVal;
    } catch (err) {
      return val;
    }
  }
}
