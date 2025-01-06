import { io as ioc } from 'socket.io-client';
import { assert } from 'chai';
import { afterEach, describe, it } from 'mocha';

describe('Socket.io connection test', () => {
    let socketClient

    before((done) => {
        socketClient = ioc('http://localhost:4000', {
            transports: ['websocket']
        });
        socketClient.on('connect', done);
    });

    after((done) => {
        if (socketClient.connected) {
            socketClient.disconnect();
        }
        done();
    });

    afterEach(() => {
        socketClient.removeAllListeners('msg-bot');
    })

    it('debería recibirse mensaje de saludo al enviar el mensaje "Hola"', (done) => {
        const userMessage = 'Hola';
        socketClient.emit('msg-user', { message: userMessage });

        socketClient.on('msg-bot', (data) => {
            try {
                assert.equal(data.message, 'Hola! Somos SushiNular 🍣 Escribí "menu" para ver nuestra carta');
                done();
            } catch (error) {
                done(error)
            }
        })
    });

    it('debería recibir la carta al enviar el mensaje "menu"', (done) => {
        const userMessage = 'Quiero ver el menu';
        socketClient.emit('msg-user', { message: userMessage });

        socketClient.on('msg-bot', (data) => {
            try {
                assert.include(data.message, 'A continuación te muestro nuestro menú')
                done();
            } catch (error) {
                done(error)
            }
        });
    });

    it('debería recibir el mensaje de dirección al enviar el mensaje "domicilio"', (done) => {
        const userMessage = 'Quiero saber su domicilio';
        socketClient.emit('msg-user', { message: userMessage });

        socketClient.on('msg-bot', (data) => {
            try {
                assert.include(data.message, 'Nos encontramos en');
                done();
            } catch (error) {
                done(error)
            }
        }
        );
    });

    it('debería recibir el pedido del usuario y preguntar por su nombre', (done) => {
        const userMessage = 'Quiero 15 piezas de sushi';
        socketClient.emit('msg-user', { message: userMessage });

        socketClient.on('msg-bot', (data) => {
            try {
                assert.equal(data.message, 'Perfecto, agregué 15 piezas de sushi a tu pedido. ¿Cuál es tu nombre?');
                done();
            } catch (error) {
                done(error)
            }
        });
    });

    it('debería recibir el nombre del usuario ("juan") y confirmar el pedido', (done) => {
        const userName = 'juan';
        socketClient.emit('msg-user', { message: userName });

        socketClient.on('msg-bot', (data) => {
            try {
                assert.equal(data.message, `¡Gracias ${userName}! Tu pedido de 15 piezas de sushi fue registrado.`);
                done();
            } catch (error) {
                done(error)
            }
        });
    });


})

describe('API /api/orders', () => {
    const apiURL = 'http://localhost:4000/api'

    it('debería responder con status=200 al consultar por las órdenes', async () => {
        try {
            const response = await fetch(`${apiURL}/orders`)
            assert.equal(response.status, 200)
        } catch (error) {
            assert.fail(`Error en  la solicitud: ${error.message}`)
        }
    })

    it('debería devolver una orden del cliente "juan" ya que se creó en el set de pruebas anterior', async () => {
        try {
            const res = await fetch(`${apiURL}/orders/juan`)
            const response = await res.json()

            assert.equal(res.status, 200)
            assert.strictEqual(response.success, true)
            assert.ok(Array.isArray(response.orders))

            const found = response.orders.some(order => order.username === 'juan')
            assert.ok(found, 'No se encontró una orden con nombre de cliente "juan"')
        } catch (error) {
            assert.fail(`Error en la solicitud: ${error.message}`)
        }
    })
})