require('dotenv').config();
const os = require('os');
const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const { getUserByIDComplety } = require('./src/models/User');
const { chatExists, updateChat, createChat, countUnreadMessages } = require("./src/models/Chat");
const { getProduct } = require('./src/models/Product');
const { sendNotificationEmail } = require('./src/models/Email');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '127.0.0.1';
const port = 3000;

// Armazenar os clientes por ID
const clients = new Map();

const httpServer = http.createServer();

httpServer
    .once('error', (err) => {
        console.error(err);
        process.exit(1);
    })
    .listen(port, hostname, () => {
        console.log(`> Ready on ws://${hostname}:${port}`);

        const wss = new WebSocket.Server({ server: httpServer });

        wss.on('connection', async (ws, req) => {
            // Analisar a URL da solicitação para obter o ID do usuário
            const id = url.parse(req.url, true).pathname.substring(1);

            const userId = id;
            if (userId) {
                const user = await getUserByIDComplety(userId);
                if (!user && ws && ws.readyState === WebSocket.OPEN) {
                    return ws.close(1008, 'Unauthorized');
                }
            } else if (ws && ws.readyState === WebSocket.OPEN) {
                return ws.close(1008, 'Unauthorized');
            }

            clients.set(id, ws);

            ws.on('message', async (msg) => {
                // Analisar a mensagem como JSON
                const data = JSON.parse(msg);

                // Enviar a mensagem para o cliente com o ID específico
                const product = await getProduct(data.productId);

                if (!product) {
                    // Se o produto não for encontrado, enviar uma mensagem de erro ao cliente
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ error: 'Product not found' }));
                    }
                    return;
                }

                let targetId;
                if (id === product.idUser.toString()) {
                    if (data.destinationId) {
                        targetId = data.destinationId;
                    } else {
                        clients.get(id).send("error");
                        return;
                    }
                } else {
                    targetId = product.idUser.toString();
                }

                const targetClient = clients.get(targetId.toString());
                if (targetClient && targetClient.readyState === WebSocket.OPEN) {
                    data.idClient = id;
                    data.read = false;
                    const now = new Date();

                    if (id !== product.idUser.toString()) {
                        data.destinationId = product.idUser;
                    }

                    const horas = now.getHours();
                    const minutos = now.getMinutes();
                    const dia = now.getDate();
                    const mes = now.getMonth() + 1;
                    const ano = now.getFullYear();

                    data.Date = `${dia}/${mes}/${ano}, ${horas}:${minutos}`;

                    if (await chatExists(data.destinationId, data.idClient, data.productId) || await chatExists(data.idClient, data.destinationId, data.productId)) {
                        await updateChat(data);
                    } else {
                        await createChat(data);
                    }
                    delete data.destinationId;

                    let unreadMessages = await countUnreadMessages(product.idUser.toString())
                    const userEmail = (await getUserByIDComplety(product.idUser.toString())).email
                    if (unreadMessages != 0 && unreadMessages >= 50) {
                        unreadMessages = "50+"
                        sendNotificationEmail(userEmail, unreadMessages)
                    }

                    targetClient.send(JSON.stringify(data));
                } else {
                    data.idClient = id;
                    data.read = false;
                    const now = new Date();

                    if (id !== product.idUser.toString()) {
                        data.destinationId = product.idUser;
                    }

                    const horas = now.getHours();
                    const minutos = now.getMinutes();
                    const dia = now.getDate();
                    const mes = now.getMonth() + 1;
                    const ano = now.getFullYear();

                    data.Date = `${dia}/${mes}/${ano}, ${horas}:${minutos}`;

                    if (await chatExists(data.destinationId, data.idClient, data.productId) || await chatExists(data.idClient, data.destinationId, data.productId)) {
                        await updateChat(data);
                    } else {
                        await createChat(data);
                    }

                    let unreadMessages = await countUnreadMessages(product.idUser.toString())
                    const userEmail = (await getUserByIDComplety(product.idUser.toString())).email
                    if (unreadMessages != 0 && unreadMessages >= 50) {
                        unreadMessages = "50+"
                        sendNotificationEmail(userEmail, unreadMessages)
                    }
                }
            });

            ws.on('close', () => {
                clients.delete(id);
            });
        });
    });
