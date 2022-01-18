import * as socketIo from 'socket.io';
export namespace IMemberController {
    export interface IMemberData {
        socket: socketIo.Socket[]
        token: string;
        id: Number;
        name: string;
        account: string;
        franchiseeId: Number;
    }
}
