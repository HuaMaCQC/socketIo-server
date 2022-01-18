import { IMemberController } from './MemberController.Interfaces';
import * as socketIo from 'socket.io';
import { IService } from '../../service/service.entity';
export const MemberController = new class {

    private io: socketIo.Server = socketIo.listen();
    public setIo(_io: socketIo.Server) {
        this.io = _io;
    }
    private _memberDatas: Map<Number, IMemberController.IMemberData> = new Map();
    /**
     * 新增使用者
     * @param data *登入成功回傳資料
     * @param socket *連接的socket
     * @param token *使用者的token
     */
    public addSocket(data: IService.ApiMemberLogin.Response, socket: socketIo.Socket, token: string) {
        let _data: IMemberController.IMemberData | undefined = MemberController._memberDatas.get(data.id);
        if (_data && _data.token === token) {
            _data.socket.push(socket);
        } else {
            if (_data) {
                _data.socket.forEach(item => {
                    item.emit('LoginOut', {});
                    item.disconnect();
                });
            }
            _data = {
                ...data,
                socket: [socket],
                token: token,
            }
        }
        MemberController._memberDatas.set(data.id, _data);
        this.joinRoom(_data, socket);
    }

    /**
     * 取得帳號所有的登入者
     * @param account 登入帳號
    */
    public getIdData(id: Number): IMemberController.IMemberData | undefined {
        return MemberController._memberDatas.get(id);
    }
    /**
     * 取得此帳號的Sockets 尋找不到資料回傳undefined
     * @param account 登入帳號
     */
    public getAccountData(account: string): IMemberController.IMemberData | undefined {
        MemberController._memberDatas.forEach((item) => {
            if (item.account === account) {
                return item;
            }
        });
        return undefined;
    }
    /**刪除此token的連線 
     * @param token 登入token
    */
    public disconnectTokenData(token: string): boolean {
        MemberController._memberDatas.forEach((item) => {
            if (item.token === token) {
                const _id = item.id;
                item.socket.forEach(_item => {
                    _item.emit('LoginOut');
                    _item.disconnect();
                });
                MemberController._memberDatas.delete(_id);
                return true;
            }
        });
        return false;
    }
    /**
     * 刪除此Id的連線
     * @param id 會員ID
     */
    public disconnectMemberIdData(id: Number): boolean {
        const _data = MemberController._memberDatas.get(id);
        if (_data) {
            _data.socket.forEach(item => {
                item.emit('LoginOut');
                item.disconnect();
            });
            MemberController._memberDatas.delete(id);
            return true;
        }
        return false;
    }
    /**取得加盟商的房間 
     * @param FranchiseeId 加盟商ID 
    */
    public getFranchiseeIdRoom(FranchiseeId: Number) {
        return this.io.to('/member/franchisee-' + FranchiseeId);
    }
    /**
     * 加入房間
     * @param data *登入成功回傳資料
     */
    private joinRoom(data: IMemberController.IMemberData, socket: socketIo.Socket) {
        socket.join('/member');
        socket.join('/member/franchisee-' + data.franchiseeId);
    }

}