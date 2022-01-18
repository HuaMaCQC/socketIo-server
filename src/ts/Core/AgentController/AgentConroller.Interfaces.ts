import * as socketIo from 'socket.io';
export namespace IAgentController {
    export interface IAgentData {
        /**代理ID */
        id: number;
        /**代理名稱 */
        name: string;
        /**代理帳號 */
        account: string;
        /**加盟商ID */
        franchiseeId: number;
        /**角色權限ID */
        roleId: number;
        /**層級 */
        level: number;
        /**LV0*/
        IsCompany:boolean;
        /**LV1*/
        IsFranchiseeRoot:boolean;
        /**連線的資訊  (多人連線會有多個socket)*/
        socketData:{
            /**代理的token */
            token: string,
            /**代理連線socket */
            socket: socketIo.Socket,
        }[],
        /**監聽的審核資料角色列表 */
        reviewRoles:number[],
    }
    export interface IJoinRoomData {
        /**代理ID */
        id: number;
        /**代理名稱 */
        name: string;
        /**代理帳號 */
        account: string;
        /**加盟商ID */
        franchiseeId: number;
        /**角色權限ID */
        roleId: number;
        /**代理連線socket*/
        socket: socketIo.Socket
        /**層級 */
        level: number;
        /**LV0*/
        IsCompany:boolean;
        /**LV1*/
        IsFranchiseeRoot:boolean;
        /**監聽的審核資料角色列表 */
        reviewRoles:number[],
    }
}
