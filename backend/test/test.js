import { io as ioc } from 'socket.io-client';
import { assert } from 'chai';
import { describe, it } from 'mocha';
describe('Socket.io connection', () => {
    let socketClient
    let userID

    before((done) => {
        socketClient = ioc('http://localhost:4000', {
            transports: ['websocket']
        });
        socketClient.connect();
        userID = socketClient.id
        if (socketClient.connected) console.log(`Socket client connected (${userID})`);
        done()
    });

    after((done) => {
        socketClient.close();
        done();
    });

    // it('debería conectarse al servidor socket', (done) => {
    //     assert(socketClient.connected);
    //     done();
    // });

    it('debería recibirse mensaje de saludo al enviar el mensaje "Hola"', (done) => {
        const userMessage = 'Hola';
        socketClient.emit('msg-user', { message: userMessage });
        socketClient.on('msg-bot', (data) => {
            assert.equal(data.message, 'Hola! Somos SushiNular 🍣 Escribí "menu" para ver nuestra carta');
            done();
        })
    });

    it('debería recibir el pedido del usuario y preguntar por su nombre', (done) => {
        const userMessage = 'Quiero 15 piezas de sushi';

        socketClient.emit('msg-user', { message: userMessage });
        socketClient.on('msg-bot', (data) => {

            assert.equal(data.message, 'Perfecto, agregué 15 piezas de sushi a tu pedido. ¿Cuál es tu nombre?');
            done();
        });
    });

    it('debería recibir el nombre del usuario y confirmar el pedido', (done) => {
        const userName = 'Juan';
        socketClient.emit('msg-user', { message: userName });
        socketClient.on('msg-bot', (data) => {
            assert.equal(data.message, `Gracias ${userName}! Tu pedido de 15 piezas de sushi fue registrado.`);
            done();
        });
    });


})