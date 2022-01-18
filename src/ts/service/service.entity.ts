export namespace IService {
    /**io的Namespace*/
    export enum IoNamespace {
        /**會員登入 */
        member = '/member',
        /**代理登入 */
        agent = '/agent',
    }


    export namespace Emit {
        export namespace Connect {
            export const EventName = 'connect';
        }
        export namespace Disconnect {
            export const EventName = 'disconnect';
            export interface Data {
                errorMessage?: string;
            }
        }
        export namespace LoginSuccess {
            export const EventName = 'login_success';
            export interface Data {
            }
        }
        export namespace Error {
            export const EventName = 'error_message';
            export interface Data {
                errorMessage:string
            }
        }
    }


    /**
     * (代理)取得登入者資訊的Data
     */
    export namespace ApiAgentLogin {
        export interface Request {
            /**登入者資訊 */
            token: string;
            /**id */
            id: number
        }
        export interface Response {
            /**user id */
            id: number;
            /**登入名稱 */
            name: string;
            /**登入帳號 */
            account: string;
            /**層級 */
            level: number;
            /**角色權限 id */
            roleId: number;
            /**加盟商 id */
            franchiseeId: number;
            /**是否可以重複登入 */
            unique: boolean;
            /**監聽的審核資料角色列表*/
            reviewRoles: number[];
        }
    }
    /**
     * (會員)取得登入者資訊的Data
     */
    export namespace ApiMemberLogin {
        export interface Request {
            /**登入者資訊 */
            token: string;
        }
        export interface Response {
            /**會員 id */
            id: number;
            /**登入名稱 */
            name: string;
            /**登入帳號 */
            account: string;
            /**加盟商 id */
            franchiseeId: number;
        }
    }
}