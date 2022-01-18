import * as express from 'express';
import * as socketIo from 'socket.io';
import config from '../../Config';
import Request from '../Core/request/Request';
import { IService } from './service.entity';
import { MemberController } from '../Core/MemberController/MemberController';
import ServiceInterfaces from './Service.Interfaces';
import { AgentController } from '../Core/AgentController/AgentController';
import { AgentReviewNotificationService } from "./agent/AgentReviewNotification/AgentReviewNotificationService";
import { IAgentController } from '../Core/AgentController/AgentConroller.Interfaces';
import { textService } from './agent/Text/text';
import { ApiPath } from '../data/api';
export const Service = new class {
    public app = express();
    private http = require('http');
    private server = this.http.createServer(this.app);
    public readonly io = socketIo().listen(this.server);
    private agentServiecs: ServiceInterfaces[] = [
        new AgentReviewNotificationService(this.io),
        new textService(),
    ];
    constructor() {
        MemberController.setIo(this.io);
        AgentController.setIo(this.io);
    }
    public start() {
        return new Promise((resolve, reject) => {
            resolve();
        }).then(() => {
            //執行start
            return Promise.all(this.agentServiecs.map(item => item.start()));
        }).then(() => {
            //註冊router
            this.agentServiecs.reduce((key, fn) => {
                if (key.indexOf(fn.routerPrefix) > 0) {
                    console.error(new Error(`routerPrefix:${fn.routerPrefix} 已存在`));
                    process.exit();
                }
                const router = express.Router();
                fn.router.bind(fn, router)();
                //每隔router的前贅字
                // console.log(router);
                this.app.use(`/agent/${fn.routerPrefix}`, router);
                key.push(fn.routerPrefix);
                return key;
            }, ['']);
        }).catch((error) => {
            console.error(error);
        });
    }
    public main() {
        return new Promise((resolve, reject) => {
            const requset = new Request();
            this.server.listen(config.serverPost, () => {
                const member = this.io.of(IService.IoNamespace.member);
                member.on('connect', socket => {
                    const token = socket.handshake.query.token
                    if (token) {
                        const data: IService.ApiMemberLogin.Request = {
                            token
                        }
                        requset.post<IService.ApiMemberLogin.Response>(ApiPath.ApiWsMemberLogin, data).then((res) => {
                            MemberController.addSocket(res, socket, token);
                        }).catch((error) => {
                            //傳送錯誤資訊到前端
                            const data: IService.Emit.Disconnect.Data = {
                                errorMessage: error
                            }
                            socket.emit(IService.Emit.Disconnect.EventName, data);
                            //斷開連線
                            socket.disconnect();
                        })
                    } else {
                        socket.emit(IService.Emit.Disconnect.EventName,{errorMessage:'not find token'});
                    }
                });


                const agent = this.io.of(IService.IoNamespace.agent);
                agent.on('connect', socket => {
                    const token = socket.handshake.query.token;
                    const id = socket.handshake.query.id;
                    if (token && id) {
                        const data: IService.ApiAgentLogin.Request = {
                            token,
                            id,
                        }
                        requset.post<IService.ApiAgentLogin.Response>(ApiPath.ApiWsAgentLogin, data).then(res => {
                            console.log(res)
                            AgentController.addSocket(res, socket, token);
                            console.log(`使用者:${res.name}${res.id}登入`);
                            return res;
                        }).then((res) => {
                            socket.on('disconnect', (v)=>{
                                AgentController.disconnectTokenData(data.id , socket.id);
                                console.log(`${res.name}已斷線`);
                            });
                            this.agentServiecs.forEach(item => {
                                item.listen(socket, res.id);
                            });
                            socket.emit(IService.Emit.LoginSuccess.EventName);
                        }).catch(error => {
                            console.log(error);
                            const data: IService.Emit.Disconnect.Data = {
                                errorMessage: error
                            }
                            socket.emit(IService.Emit.Disconnect.EventName, data);
                            socket.disconnect();
                        });
                    }else {
                        socket.emit(IService.Emit.Disconnect.EventName,{errorMessage:'not find token'});
                    }
                });
            });
        });
    }
    public joinAgentRoom(error: any, data: IAgentController.IJoinRoomData) {
        this.agentServiecs.forEach(item => {
            if (item.joinAgentRoom) {
                item.joinAgentRoom(error, data);
            }
        });
    }
}
