import Request from '../Core/request/Request';
import { MemberController } from '../Core/MemberController/MemberController';
import { AgentController } from '../Core/AgentController/AgentController';
export default abstract class AgentServiceAbstract {
    /**會員資料 */
    protected memberController = MemberController;
    /**代理資料 */
    protected agentController = AgentController;
    /**訪問後端 */
    protected request = new Request();
}