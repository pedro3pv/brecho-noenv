import { GetServerSidePropsContext } from "next";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Header from "../../lib/components/Header";
import { parse, serialize } from 'cookie';
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Footer from "../../lib/components/Footer";
import { ParsedUrlQuery } from "querystring";
import { getProduct } from "../../lib/models/Product";
import { getUserByEmailComplety, getUserByIDComplety } from "../../lib/models/User";
import { verifyToken } from "../../lib/jsonwebtoken";
import { getChat } from "../../lib/models/Chat";
import { ObjectId } from "mongodb";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {

    function serializeChat(chat: any) {
        if (chat) {
            if (chat._id) {
                chat._id = chat._id.toString();
            }
            if (chat.sellerId) {
                chat.sellerId = chat.sellerId.toString();
            }
            if (chat.buyerId) {
                chat.buyerId = chat.buyerId.toString();
            }
            if (chat.productId) {
                chat.productId = chat.productId.toString();
            }
            if (chat.messages) {
                chat.messages = chat.messages.map((message: any) => {
                    if (Array.isArray(message)) {
                        return message.map((item: any) => {
                            if (item instanceof ObjectId) {
                                return item.toString();
                            }
                            return item;
                        });
                    }
                    return message;
                });
            }
        }
        return chat;
    }

    function serializeProduct(product: any) {
        if (product) {
            product.idUser = product.idUser.toString()
        }
        return product
    }

    const parsedUrlQuery: ParsedUrlQuery = context.query;
    const cookies = parse(context.req.headers.cookie || '');
    const token = cookies.token;
    const email = await verifyToken(token)
    const idUser = parsedUrlQuery.idUser as string;
    const idProduct = parsedUrlQuery.idProduct as string;
    let product;
    let user;
    let chat;
    if (idProduct) {
        product = await getProduct(idProduct)
        if (token || token != "" && token || token != undefined && token) {
            user = await getUserByEmailComplety(email.email)
            if (user && product?.idUser == user._id.toString() && idUser && product) {
                chat = await getChat(product.idUser, idUser, idProduct)
                if (!chat){
                    return {
                        notFound: true
                    }
                }
            } else if (user && product?.idUser != user._id.toString() && product) {
                chat = await getChat(product.idUser, user._id.toString(), idProduct)
            } else {
                return {
                    notFound: true
                }
            }
        } else {
            return {
                notFound: true
            }
        }
    } else {
        return {
            notFound: true
        }
    }

    return {
        props: {
            ...(await serverSideTranslations(context.locale!, ['common'])),
            chat: await serializeChat(chat),
            chat1: (user && product?.idUser == user._id.toString() && idUser && product) ? user._id.toString() : product.idUser.toString(),
            chat2: (user && product?.idUser == user._id.toString() && idUser && product) ? product.idUser.toString() : user._id.toString(),
            productId: idProduct,
            product: serializeProduct(product),
            userId: idUser || null,
            client: user._id.toString()
        }
    }
};

export default function ChatPage(data: any) {
    const router = useRouter();
    const { t } = useTranslation('common');
    const [messages, setMessages] = useState<any[]>((data.chat?.messages) ? data.chat.messages : []);
    const [input, setInput] = useState<string>("");
    const socketRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const connectWebSocket = () => {
        socketRef.current = new WebSocket(`wss://brecho.macacosunidos.studio/${data.client}`);

        socketRef.current.onmessage = (event) => {
            //{"message":"test10","productId":"6643465fdb4605680c9cbca1","idClient":"6643f41093f2db3cba66ab13","read":false,"Date":"22/5/2024, 22:45"}
            const json = JSON.parse(event.data)
            const message: string[] = [json.idClient, json.message, json.read, json.Date]
            setMessages((currentMessages) => [...currentMessages, message]);
        };
    };

    const sendMessage = (text: string) => {
        if (socketRef.current) {
            let message;
            if (data.client != data.product.idUser) {
                message = {
                    "message": text.toString(),
                    "productId": data.productId
                }
            } else {
                message = {
                    "message": text.toString(),
                    "productId": data.productId,
                    "destinationId": data.userId
                }
            }
            socketRef.current.send(JSON.stringify(message));
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        connectWebSocket();
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [messages]);

    const handleSend = (e: FormEvent) => {
        e.preventDefault();

        if (input.trim()) {
            const now = new Date();

            const horas = now.getHours();
            const minutos = now.getMinutes();
            const dia = now.getDate();
            const mes = now.getMonth() + 1;
            const ano = now.getFullYear();

            const date = `${dia}/${mes}/${ano}, ${horas}:${minutos}`

            const fakeMessage: string[] = [data.client, input.toString(), false, date]
            setMessages([...messages, fakeMessage]);
            sendMessage(input)
            setInput("");
        }
    }



    return (
        <main className={"h-screen w-screen flex flex-col"}>
            <Header />
            <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-100">
                <div className="w-full max-w-lg bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-4 border-b">
                        <h1 className="text-xl font-semibold">{t('chatTitle', 'Chat ')}</h1>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto" style={{ height: '300px' }}>
                        {messages.map((message, index) => (
                            <div key={index} className="mb-2">
                                <div className={(message[0] === data.chat2 ? 'bg-blue-100' : 'bg-blue-300') + ' p-2 rounded-lg flex flex-col break-words'}>
                                    <span className="break-words">{message[1]}</span>
                                    <span className="text-xs text-gray-500">{message[3].replace(/,/g, '')}</span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSend} className="p-4 border-t flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 p-2 border rounded-lg"
                            placeholder={t('Escreva aqui', 'Escreva sua mensagem...')}
                        />
                        <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded-lg">
                            {t('Enviar', 'enviar')}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </main>
    );

}


