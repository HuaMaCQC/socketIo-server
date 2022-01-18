import * as socketIo from 'socket.io';
import { IAgentController } from './AgentConroller.Interfaces';
import { IService } from '../../service/service.entity';
import { Service } from '../../service/Service';

export const AgentController = new class {
    private io: socketIo.Server = socketIo.listen();
    public setIo(_io: socketIo.Server) {
        this.io = _io;
    }

    private _AgentDatas: Map<number, IAgentController.IAgentData> = new Map();
    /**
     * 新增使用者
     * @param data *登入成功回傳資料
     * @param socket *連接的socket
     * @param token *使用者的token
     */
    public addSocket(data: IService.ApiAgentLogin.Response, socket: socketIo.Socket, token: string) {
        const unique = data.unique;
        let _data = AgentController._AgentDatas.get(data.id);
        if (_data && _data.socketData.find(item => item.token === token)) { //重複token連線
            _data.socketData.push({
                token: token,
                socket: socket,
            })
        } else { //新的token連線
            //開始踢人
            if (unique && _data) {
                _data.socketData.forEach(v => {
                    const message: IService.Emit.Disconnect.Data = { errorMessage: '重複登入' }
                    v.socket.emit(IService.Emit.Disconnect.EventName, message);
                    v.socket.disconnect();
                });
                _data.socketData.length = 0;
                delete _data.socketData;
            }
            const socketData = _data && _data.socketData ? _data.socketData : [];
            console.log(socketData);
            socketData.push({
                socket: socket,
                token: token,
            });
            console.log(data);
            _data = {
                socketData: socketData,
                id: data.id,
                name: data.name,
                account: data.account,
                roleId: data.roleId,
                franchiseeId: data.franchiseeId,
                level: data.level,
                IsCompany: data.level === 0,
                IsFranchiseeRoot: data.level === 1,
                reviewRoles: data.reviewRoles,

            };
        }
        //新增回使用者資料
        AgentController._AgentDatas.set(data.id, _data);
        this.joniRoom(_data, socket);
    }

    /**
     * 取得ID所有的登入者
     * @param id 登入帳號
    */
    public getIdData(id: number): IAgentController.IAgentData | undefined {
        const _data = AgentController._AgentDatas.get(id);
        return _data;
    }
    /**
     * 取得此account的Sockets 尋找不到資料回傳undefined
     * @param token 登入token
     * @param account 登入帳號
     */
    public getAccountData(account: string): IAgentController.IAgentData | undefined {
        AgentController._AgentDatas.forEach((item) => {
            if (item.account === account) {
                return item;
            }
        });
        return undefined;
    }
    /**刪除此token的連線 
     * @param token 登入token
     * @param id 登入帳號
    */
    public disconnectTokenData(id: number, socketId: string) {
        const data = AgentController._AgentDatas.get(Number(id));
        if (data != undefined) {
            data.socketData = data.socketData.filter(item => item.socket.id !== socketId);
            if (data.socketData.length === 0) {
                AgentController._AgentDatas.delete(id);
            } else {
                AgentController._AgentDatas.set(id, data);
            }
        }
    }

    /**取得加盟商的房間 
     * @param FranchiseeId 加盟商ID 
    */
    public getFranchiseeIdRoom(franchiseeId: number): socketIo.Namespace {
        return this.io.of(IService.IoNamespace.agent).to('/agent/franchisee/' + franchiseeId);
    }

    /**取得加盟商的房間 
    * @param FranchiseeId 加盟商ID 
    */
    public getRoleIdRoom(RoleId: number): socketIo.Namespace {
        return this.io.of(IService.IoNamespace.agent).to('/agent/role-' + RoleId);
    }

    /** 取得代理房間*/
    public getAgentRoom(): socketIo.Namespace {
        return this.io.of(IService.IoNamespace.agent).to('/agent');
    }

    private joniRoom(data: IAgentController.IAgentData, socket: socketIo.Socket) {
        const roomData: IAgentController.IJoinRoomData = {
            id: data.id,
            name: data.name,
            account: data.account,
            franchiseeId: data.franchiseeId,
            roleId: data.roleId,
            socket: socket,
            level: data.level,
            IsCompany: data.IsCompany,
            IsFranchiseeRoot: data.IsFranchiseeRoot,
            reviewRoles: data.reviewRoles,
        };
        socket.join('/agent', (err) => Service.joinAgentRoom(err, roomData));
        socket.join('/agent/franchisee-' + data.franchiseeId);
        socket.join('/agent/role-' + data.roleId);
    }
}