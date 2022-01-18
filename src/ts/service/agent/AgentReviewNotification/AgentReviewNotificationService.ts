import ServiceInterfaces from '../../Service.Interfaces';
import * as express from 'express';
import AgentServiceAbstract from '../../AgentService.Abstract';
import { IAgentReviewNotificationService } from './AgentReviewNotificationService.entity';

import socketIo = require('socket.io');
import { ApiPath } from '../../../data/api';
import { IAgentController } from '../../../Core/AgentController/AgentConroller.Interfaces';
import { IService } from '../../service.entity';

export class AgentReviewNotificationService extends AgentServiceAbstract implements ServiceInterfaces {
    public routerPrefix = 'review-notification';
    private io: socketIo.Server;

    constructor(io: socketIo.Server) {
        super();
        this.io = io;
    }

    private _reviewData: IAgentReviewNotificationService.ReviewData[] = [];

    public start(): Promise<{}> {
        return new Promise((resolve, reject) => {
            this.request.get<IAgentReviewNotificationService.ApiWsAgentReviewNotification.Response[]>
                (ApiPath.ApiWsAgentReviewNotification, {}).then((res) => {
                    this._reviewData = res;
                    resolve();
                });
        });
    }

    public listen(socket: socketIo.Socket, agentId: number) {
        /**重置審核資訊 */ //lv0 (roleid 可選 franchiseeId 可選) IsCompany = LV0 , IsFranchiseeRoot = LV1
        socket.on(IAgentReviewNotificationService.On.Reset.EventName,
            (data, callback) => {
                if (typeof data === "object") {
                    const user = this.agentController.getIdData(agentId);
                    if (user && (data.type || data.type === '')) {
                        const findData = {
                            franchiseeId: user.franchiseeId,
                            roleId: user.roleId,
                            type: data.type || '',
                        }
                        this.getNotification(findData, (ReviewNotification: IAgentReviewNotificationService.ReviewData[]) => {
                            console.log(ReviewNotification , 2);
                            this.emitData(ReviewNotification);
                        });
                        if (typeof callback === 'function') {
                            callback(true);
                        }
                    } else {
                        if (typeof callback === 'function') {
                            callback(false);
                        }
                        const errorMessage = user ? 'not find arguments or arguments Error' : 'not find user';
                        socket.emit(IService.Emit.Error.EventName, errorMessage);

                    }
                } else {
                    console.error('socket event name:"review_notification_reset" the arguments 1 is not object');
                }
            });

    }
    public router(router: express.Express) {
        router.get(IAgentReviewNotificationService.Router.Update.url, (req, res) => {
            const data: IAgentReviewNotificationService.ApiWsAgentReviewNotification.Request = {
                franchiseeId: req.query.franchiseeId || 0,
                roleId: req.query.roleId || 0,
                type: req.query.type
            };
            this.getNotification(data, (ReviewNotification: IAgentReviewNotificationService.ReviewData[]) => {
                this.emitData(ReviewNotification);
            });
            res.send();
        });
    }

    /**
     * 取得待審核資料的筆數(訪問後端)
     * @param data 查詢資料
     * @param callback 查詢結果
     */
    private getNotification(data: IAgentReviewNotificationService.ApiWsAgentReviewNotification.Request, callback: Function) {
        this.request.get<IAgentReviewNotificationService.ApiWsAgentReviewNotification.Response[]>
            (ApiPath.ApiWsAgentReviewNotification, data).then((res) => {
                let ReviewNotification: IAgentReviewNotificationService.ReviewData[] = [];
                let newReviewNotification: IAgentReviewNotificationService.ReviewData[] = res;
                //取得這次要更新的資料
                const dataType = data.type && data.type === '' ? data.type : null;
                if (this._reviewData.length > 0) {
                    this._reviewData = this._reviewData.filter(item => {
                        if (
                            (data.franchiseeId === 0 || item.franchiseeId === data.franchiseeId) &&
                            (data.roleId === 0 || item.roleId === data.roleId) &&
                            ((dataType === null || item.type === dataType))
                        ) {
                            ReviewNotification.push({ ...item });
                            return false;
                        }
                        return true;
                    });
                } else {
                    ReviewNotification = res
                }
                this._reviewData = this._reviewData.concat(res);

                const newRids = res.map(r => `${r.franchiseeId}-${r.roleId}-${r.type}`);
                ReviewNotification.filter(item => {
                    const key = `${item.franchiseeId}-${item.roleId}-${item.type}`;
                    return newRids.indexOf(key) < 0;
                }).forEach(dr => {
                    newReviewNotification.push({
                        ...dr,
                        nums: 0,
                    });
                });
                callback(newReviewNotification);
            });
    }

    /**加入房間後 */
    public joinAgentRoom(error: any, data: IAgentController.IJoinRoomData): void {
        if (error) {
            console.log(error);
            return;
        }
        console.log(data.reviewRoles);
        data.reviewRoles.forEach(id => {
            data.socket.join(`ReviewNotification/${data.franchiseeId}-${id}`);
        });
        if (data.franchiseeId === 0) {
            const ReviewData: IAgentReviewNotificationService.Emit.ReviewNotification.Data[] = this._reviewData.filter(item => {
                return data.reviewRoles.indexOf(item.roleId) > -1;
            });
            data.socket.emit(IAgentReviewNotificationService.Emit.ReviewNotification.EventName, ReviewData);
        } else {
            const keys = data.reviewRoles.map(item => `${data.franchiseeId}-${item}`);
            const ReviewData: IAgentReviewNotificationService.Emit.ReviewNotification.Data[] = this._reviewData.filter(item => {
                const key = `${item.franchiseeId}-${item.roleId}`;
                return keys.indexOf(key) > -1;
            });
            data.socket.emit(IAgentReviewNotificationService.Emit.ReviewNotification.EventName, ReviewData);
        }
    }

    /**發送房間資料 */
    private emitData(data: IAgentReviewNotificationService.ReviewData[]) {
        const map = new Map<string, IAgentReviewNotificationService.ReviewData[]>();
        console.log(data);
        data.forEach(item => {
            if(item.franchiseeId != 0){
                const v = map.get(`${item.franchiseeId}-${item.roleId}`) || [];
                v.push(item);
                map.set(`${item.franchiseeId}-${item.roleId}`, v);
            }
            const companyV = map.get(`0-${item.roleId}`) || [];
            companyV.push(item);
            map.set(`0-${item.roleId}`, companyV);
        });
        map.forEach((value, key) => {
            const data: IAgentReviewNotificationService.Emit.ReviewNotification.Data[] = value;
            this.io.of('/agent').to(`ReviewNotification/${key}`).emit(IAgentReviewNotificationService.Emit.ReviewNotification.EventName, data);
        });
        // return this.io.of('/agent').to(`ReviewNotification/${franchiseeId}-${roleId}`);
    }
}


/**
 * 1.開啟伺服器取得所有的資訊
 */