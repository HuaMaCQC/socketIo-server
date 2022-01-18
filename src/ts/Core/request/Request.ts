import * as request from 'request';
import Config from '../../../Config';
enum ResponseType {
    JSON = 'json',
    Text = 'text',
}

export default class Request {

    private options = {
        type: ResponseType.JSON,
    };

    TYPE = ResponseType;
    private host = Config.RequestHost
    type(type: ResponseType) {
        this.options.type = type;
        return this;
    }

    post<T>(url: string, form: any = null) {
        return new Promise<T>((resolve, reject) => {
            request.post({  url: this.host + url , form }, (err, response, buffer) => {
                let statusCode = response && response.statusCode || null;
                if (err) {
                    reject(err.message);
                } else if (response.statusCode !== 200) {
                    let statusError = `Request Failed.\nStatus Code: ${statusCode}<br/>`;
                    reject(statusError + buffer.toString());
                } else {
                    let str = buffer.toString();
                    try {
                        this.options.type === ResponseType.JSON
                            ? resolve(JSON.parse(str))
                            : resolve(str);
                    } catch (e) {
                        reject(str);
                    }
                }
            });
        });
    }
    public get<T>(url: string, form: any = null) {
        return new Promise<T>((resolve, reject) => {
            request.get({ url: this.host + url , form }, (err, response, buffer) => {
                let statusCode = response && response.statusCode || null;
                if (err) {
                    reject(err.message);
                } else if (response.statusCode !== 200) {
                    let statusError = `Request Failed.\nStatus Code: ${statusCode}<br/>`;
                    reject(statusError + buffer.toString());
                } else {
                    let str = buffer.toString();
                    try {
                        this.options.type === ResponseType.JSON
                            ? resolve(JSON.parse(str))
                            : resolve(str);
                    } catch (e) {
                        reject(str);
                    }
                }
            });
        });
    }

}