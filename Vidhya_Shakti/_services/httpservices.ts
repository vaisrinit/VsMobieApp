import { Utils } from "../utils/utils";
import RNFetchBlob from 'react-native-blob-util';


export class HttpService {

    // public api_end_point = 'http://192.168.157.154:3001';
    public api_end_point = 'https://test.appedo.com:9001';


    public utils: any;
    public static token: any
    public static keyEncryptDecrypt: any
    public static usr: any


    constructor() {
        this.utils = new Utils()
    }

    storeData(param: any) {
        let data = JSON.parse(atob(param.result));
        HttpService.token = data.token
        let len = data.token.substring(0, 2);
        let keyLength = this.utils.hexToShort(len);
        HttpService.keyEncryptDecrypt = data.token.substring(data.token.length - keyLength);
        HttpService.usr = data.user;


    }
    noAuthHttpPostRequest(path: any, param: any) {
        let encrypted_param = this.utils.noAuthEncrypt(JSON.stringify(param));
        return fetch(this.api_end_point + path, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "param": encrypted_param })
        })
    }

    noAuthHttpGetRequest(path: any, param: any) {
        let encrypted_param = this.utils.noAuthEncrypt(JSON.stringify(param));
        return fetch(this.api_end_point + path, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
    }

    authHttpPostRequest(path: any, param: any) {
        let encrypted_param = this.utils.encrypt(JSON.stringify(param));
        return fetch(this.api_end_point + path, {
            method: 'POST',
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json', //request format
                'Authorization': HttpService.token
            }),
            body: JSON.stringify({ "param": encrypted_param })
        })
    }

    async authImageUpload(path: any, param: any) {
        const image = await fetch(param.image)
        const blob = await image.blob();
        return fetch(this.api_end_point + path, {
            method: 'POST',
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'image/jpeg', //request format
                'Authorization': HttpService.token
            }),
            body: blob
        })
    }

    sendImage(path: any, param: any) {
        try {
            return RNFetchBlob.fetch('POST', this.api_end_point + path, {
                'Content-Type': 'multipart/form-data',
            }, [
                {
                    name: 'image',
                    filename: 'image.jpg',
                    type: 'image/jpeg',
                    data: RNFetchBlob.wrap(param.image)
                }
            ]);
        } catch (error) {
            return error
        }
    };

    authHttpGetRequest(path: any) {
        return fetch(this.api_end_point + path, {
            method: 'GET',
            headers: new Headers({
                Accept: 'application/json', //response format
                'Authorization': HttpService.token
            }),
        })
    }


}