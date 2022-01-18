export interface IManagerResult<T=any> {
    /**是否成功 */
    success: boolean;
    /**請求成功返回的資料*/
    data?: T;
    

}