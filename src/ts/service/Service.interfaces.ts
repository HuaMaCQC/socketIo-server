import { IAgentController } from "../Core/AgentController/AgentConroller.Interfaces";
import socketIo from 'socket.io';
import * as express from 'express';
import { promises } from "fs";
export default interface ServiceInterfaces {
    /**伺服器開啟時執行*/
    start(): Promise<{}>;
    /**監聽 */
    listen(socket: socketIo.Socket, agentId: number): void;
    /**加入房間後要做的事情 */
    joinAgentRoom?(error: any, data: IAgentController.IJoinRoomData): void;
    /**路由 */
    router(router: express.Router): void;
    /**router前贅字 */
    routerPrefix: string;
}