import * as express from 'express';
import * as socketIo from 'socket.io-client';
import { IService } from './ts/service/service.entity';
import { IAgentReviewNotificationService } from './ts/service/agent/AgentReviewNotification/AgentReviewNotificationService.entity';
import { ApiPath } from './ts/data/api';
interface IDebug {
    method: string;
    url: string;
    sendDate: any;
    response: any;
}

export const Debug = new class {
    // private debug(): Array<IDebug> {
    //     return [
    //         { method: 'post', url: ApiPath.ApiWsAgentLogin, sendDate: {}, response: { id: 1, name: '小花媽', account: 'HuaMa', onlineQuantity: 2, roleId: 2, franchiseeId: 1, } },
    //         { method: 'get', url: ApiPath.ApiWsAgentReviewNotification, sendDate: {}, response: [{ key: 'aa', name: '666', nums: '1' }, { key: 'bb', name: '777', nums: '2' }] }
    //     ];
    // }
    private init = {
        "refresh": {
            "user": {
                "id": 1,
                "token": "yPMeDXKBKIfQkxWV4PyXyMBzXc9fvXFpeHkgd07N",
                "account": "admin",
                "name": "admin",
                "extend": null,
                "role": {
                    "id": 1,
                    "name": "神 God",
                    "rank": 0
                },
                "franchisee": null,
                "locked": 0,
                "level": 0,
                "views": [],
                "apis": [
                ],
                "wallet": null
            }
        }
    }
    private wslogin = {
        "id": 1,            // number user id
        "unique": true,        // boolean 是否唯一登入(true.必需互踢, false.可重複)
        "name": 'admin',          // string 登入名稱
        "account": 'admin',       // string 登入帳號
        "level": 0,         // number 層級
        "roleId": 0,        // number 角色權限
        "franchiseeId": 0,  // number 加盟商 id
        "reviewRoles": [1],   // number[] 監聽的審核資料角色列表
    }
    private reviewNotification = [
        {
            franchiseeId: 0,
            roleId: 1,
            type: 'MemberRegister',
            nums: 2,
        },
        {
            franchiseeId: 0,
            roleId: 1,
            type: 'AgentDepositBank',
            nums: 3,
        }
        , {
            franchiseeId: 0,
            roleId: 1,
            type: 'MemberDepositBank',
            nums: 5,
        }
    ];
    public startDebug() {
        const app = express();
        const http = require('http');
        const server = http.createServer(app);
        const isdebug = true;
        if (isdebug) {
            // this.debug().forEach((item) => {
            //     if (item.method == 'get') {
            //         app.get(item.url, (req, res) => {
            //             res.send(item.response);
            //         });
            //     } else {
            //         app.post(item.url, (req, res) => {
            //             res.send(item.response);
            //         });
            //     }
            // });
            app.use(express.static('src'));
            /**前端初始化 */
            app.get('/api/public/init', (req, res) => {
                res.send(this.init)
            })
            /**後端登入 */
            app.post('/api/ws/agent/login', (req, res) => {
                res.send(this.wslogin);
            });
            /**後端傳rev init */
            app.get('/api/ws/agent/review/notification', (req, res) => {
                res.send(this.reviewNotification);
            })
            /**更新資料 */
            app.get('/Demo/update', (req, res) => {
                this.reviewNotification.forEach(v => {
                    if (req.query.roleId == v.roleId && req.query.type === v.type) {
                        v.nums = Number(req.query.nums);
                    }
                });

                if (!this.reviewNotification.find(v => v.type == req.query.type)) {
                    console.log(123);
                    this.reviewNotification.push({
                        franchiseeId: 0,
                        roleId: req.query.roleId,
                        type: req.query.type,
                        nums: req.query.nums,
                    })
                }
                console.log(this.reviewNotification);
                res.send('ok');
            });
            app.get('/debug.html', (req, res) => {
                res.sendFile(__dirname + '/' + 'debug.html');
            });
            server.listen(3000, () => {
                console.log('port:3000 listen');
            });
        }
    }
}


