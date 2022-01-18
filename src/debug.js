"use strict";

function socketClick(token, ID) {
    const socket = io('http://127.0.0.1:8080/agent', {
        query: {
            token: token.value,
            id: ID.value,
        },
    });

    socket.on('connect', () => {
        console.log('connect');
    });

    socket.on('/review/notification', (res) => {
        console.log('aaa');
        console.log(res);
    });

    /**登入失敗 */
    socket.on('/disconnect/error', (res) => {
        console.log('登入失敗');
        console.log(res);
    });

    /**登出 */
    socket.on('/login/out', (res) => {
        console.log('/login/out');
        console.log(res);
    });

    socket.on('tt', (res) => {
        console.log('awa')
    });
    // setInterval(function() {
    //     console.log(123);
    //     socket.emit('/review/notification/update');
    // }, 3000);
}