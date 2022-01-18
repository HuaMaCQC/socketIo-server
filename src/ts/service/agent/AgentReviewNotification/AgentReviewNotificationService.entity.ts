export namespace IAgentReviewNotificationService {


    export namespace On {
        /**刷新 */
        export namespace Reset {
            export const EventName = 'review_notification_reset';
            export interface Data {
                type?: string;
            }
        }
    }

    export namespace Emit {
        /**發送代理資訊*/
        export namespace ReviewNotification {
            export const EventName = 'review_notification';
            export interface Data {
                /**角色 id */
                franchiseeId: number;
                /**角色 id */
                roleId: number;
                /**審核類型  */
                type: string;
                /**待審查筆數 */
                nums: number;
            }
        }
    }

    /**取得審核的資訊的資料*/
    export namespace ApiWsAgentReviewNotification {
        export interface Request {
            /**加盟商 id (若不限制則為空值 or 0) */
            franchiseeId: number;
            /**角色 id (若不限制則為空值 or 0)*/
            roleId: number;
            /**審核類型 (不限制則為空值) */
            type?: string;

        }
        export interface Response {
            /**加盟商 id */
            franchiseeId: number;
            /**角色 id */
            roleId: number;
            /**審核類型  */
            type: string;
            /**待審查筆數 */
            nums: number;
        }
    }

    export namespace Router {
        /**重置 */
        export namespace Update {
            export const url = '/update';
            export interface Data {

            }
        }
    }

    export interface ReviewData {
        /**角色 id */
        franchiseeId: number;
        /**角色 id */
        roleId: number;
        /**審核類型  */
        type: string;
        /**待審查筆數 */
        nums: number;
    }

    /**關聯資料表 */
    export interface ReviewRoles {
        /**加盟商 id*/
        franchiseeId: number;
        /**角色 id */
        roleId: number;
        /**可以看到審查資料的roleId */
        reviewRoles: number[];
    }

}