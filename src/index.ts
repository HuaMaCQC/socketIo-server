// import Request from "./core/Request";
import NotificationSchedule from "./Schedules/NotificationSchedule";
import './i18n';
import * as express from 'express';
import * as socketIo from 'socket.io';
// const http = require('http');
const host = '127.0.0.1:8080';
import Request from './ts/Core/request/Request'
import config from './Config'
import {Service} from './ts/service/Service';
const notificationSchedule = new NotificationSchedule(host);
notificationSchedule.start();
import { Debug } from "./debug";
import * as i18n from 'i18n';

console.log(i18n.__('abc.def'));

// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const io = socketIo().listen(server);
Debug.startDebug();
Service.start().finally(()=>{
   return Service.main();
}).catch((error)=>{
    console.error(error);
});
// /**使用者登入 */
// app.get('/user/logout', (req, res) => {
//     const request: IUserData = req.query;
//     const data: IApiUserLogin.Request = {
//         token: request.token
//     };
//     new Request().post<IApiUserLogin.Response>('http://127.0.0.1:3000' + ApiPath.ApiUserLogin, data).then((data) => {
//         /**確認是否可以登入 */
//         // UserDatas.addUserSocket(data,socket,data.token);
//         res.send(data);
//     }).catch((data) => {
//         console.log('err' + data);
//         res.send(data);
//     });
// });



// io.on('connection', socket => {
//     const data: IApiUserLogin.Request = {
//         token: socket.handshake.query.token
//     };

//     new Request().post<IApiUserLogin.Response>('http://127.0.0.1:3000' + ApiPath.ApiUserLogin, data).then((res) => {
//         UserDatas.addUserSocket(res, socket, data.token);
//         socket.emit('LoginSuccess', res);
//     }).catch((error) => {
//         /**傳送錯誤資訊到前端*/
//         socket.emit('LoginError', error);
//         //斷開連線
//         socket.disconnect();
//     });
// })



// server.listen(8080, () => {
//     console.log('Server Bound');
// });



