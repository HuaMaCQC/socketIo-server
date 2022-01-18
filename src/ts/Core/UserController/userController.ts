// import { IUserController } from './UserController.interfaces';
// import * as socketIo from 'socket.io';
// import { ILoginService } from '../../data/LoginService.entity';
// export const UserController = new class {
//     private _userDatas: Map<String, IUserController.IUserData[]> = new Map();
//     /**
//      * 新增使用者
//      * @param data *登入成功回傳資料
//      * @param socket *連接的socket
//      * @param token *使用者的token
//      */
//     public addUserSocket(data: ILoginService.Response, socket: socketIo.Socket, token: string) {
//         const onlineQuantity = data.onlineQuantity || 1;
//         const _data: IUserController.IUserData[] = UserController._userDatas.get(data.account) || [];

//         if (_data.find(item => item.token === token)) { //重複token連線
//             //將socken加入同個tokrn裡
//             _data.forEach(item => {
//                 if (item.token === token) {
//                     item.socket.push(socket);
//                 }
//             });
//             //檢查一下是否要踢人 (除非onlineQuantity更動 不然不會踢人)
//             while (_data.length > onlineQuantity) {
//                 _data[0].socket.forEach(item => {
//                     item.emit('LoginOut', {});
//                     item.disconnect();
//                 });
//                 _data.splice(0, 1);
//             }

//         } else { //新的token連線
//             //開始踢人
//             while (_data.length > onlineQuantity - 1) {
//                 _data[0].socket.forEach(item => {
//                     item.emit('LoginOut', {});
//                     item.disconnect();
//                 });
//                 _data.splice(0, 1);
//             }
//             _data.push({
//                 socket: [socket],
//                 token: token,
//                 id: data.id,
//                 name: data.name,
//                 account: data.account,
//             })
//         }
//         //新增回使用者資料
//         UserController._userDatas.set(data.account, _data);
//     }

//     /**
//      * 取得帳號所有的登入者
//      * @param account 登入帳號
//     */
//     public getAccountData(account: string): IUserController.IUserData[] | undefined {
//         const _data: IUserController.IUserData[] | undefined = UserController._userDatas.get(account) || undefined;
//         return _data;
//     }
//     /**
//      * 取得此token的Sockets 尋找不到資料回傳undefined
//      * @param token 登入token
//      * @param account 登入帳號
//      */
//     public getTokenData(token: string, account?: string): IUserController.IUserData | undefined {
//         if (account) {
//             const data = UserController._userDatas.get(account);
//             if (data != undefined) {
//                 const _data = data.find(_item => _item.token === token);
//                 if (_data != undefined) {
//                     return _data;
//                 }
//             }
//         }
//         UserController._userDatas.forEach((item) => {
//             const _data = item.find(_item => _item.token === token);
//             if (_data != undefined) {
//                 return _data;
//             }
//         });
//         return undefined;
//     }
//     /**刪除此token的連線 
//      * @param token 登入token
//      * @param account 登入帳號
//     */
//     public disconnectTokenData(token: string, account?: string){
//         if (account) {
//             const data = UserController._userDatas.get(account);
//             if (data != undefined) {
//                 const _data = data.find(_item => _item.token === token);
//                 if (_data != undefined) {
//                     _data.socket.forEach(item => {
//                         item.disconnect();
//                         item.emit('LoginOut', {});
//                     });
//                 }
//             }
//         }
//         UserController._userDatas.forEach((item) => {
//             const _data = item.find(_item => _item.token === token);
//             if (_data != undefined) {
//                 return _data;
//             }
//         });
//         return undefined;
//     }
//     /**
//      * 刪除此帳號的連線
//      * @param account 
//      */
//     public disconnectAccountData(account: string){
//         const _data: IUserController.IUserData[] | undefined = UserController._userDatas.get(account);
//         if(_data){
//             _data.forEach(item => {
//                 item.socket.forEach(_socket => {
//                     _socket.emit('LoginOut', {});
//                     _socket.disconnect();
//                 })
//             })
//         }
//         UserController._userDatas.delete(account);
//     }
    
// }