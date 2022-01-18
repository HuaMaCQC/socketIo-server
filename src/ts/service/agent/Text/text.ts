import AgentServiceAbstract from "../../AgentService.Abstract";
import ServiceInterfaces from "../../Service.Interfaces";

export class textService extends AgentServiceAbstract implements ServiceInterfaces {
    start(): Promise<{}> {
        return new Promise((resolve, reject) => {resolve()});
    }    
    listen(socket: import("socket.io").Socket, agentId: number): void {
        
    }
    router(router: import("express").Router): void {
        router.get('update',()=>{})
    }
    routerPrefix: string = 'text';


}