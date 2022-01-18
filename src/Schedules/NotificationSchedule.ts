import { setInterval } from "timers";
import Request from "../ts/Core/request/Request";

enum URL {
    CheckAll = '/api/ns/notification/check/all',
}

export default class NotificationSchedule {


    private loading = false;

    private timer: NodeJS.Timer | null = null;

    private delay = 3000;

    private host = '';

    constructor (host: string) {
        this.host = host;
    }


    start () {
        this.timer = setInterval(() => {
            // this.callCheckAll();
        }, this.delay);
    }


    private callCheckAll () {
        if (this.loading) {
            return;
        }
        this.loading = true;
        new Request().post(this.host + URL.CheckAll).then(res => {
            // on success
        }, err => console.error(err)).then(() => {
            this.loading = false;
        })
    }

}