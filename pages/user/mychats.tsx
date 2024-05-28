import Header from "../../lib/components/Header";
import React, { useState } from "react";
import Footer from "../../lib/components/Footer";
import { LuBox } from "react-icons/lu";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext } from "next";
import { parse } from "cookie";
import { verifyToken } from "../../lib/jsonwebtoken";
import { getUserByEmailComplety } from "../../lib/models/User";
import { getProduct, getProductApproved } from "../../lib/models/Product";
import { countUnreadMessagesProductIdAndBuyerId, getAllChatsByBuyerId } from "../../lib/models/Chat";
import ListChatWithProducts from "../../lib/components/ListChatWithProducts";

export type NewOrder = {
    id: string;
    product: string;
    date: string;
    price: number;
    status: string;
    photo: string;
};

export type NewProduct = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    categories: string;
    photo: string;
};


export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const cookies = parse(context.req.headers.cookie || '');
    const token = cookies.token;
    let chats: any[];
    let json: any[] = [];

    if (token || token != "" && token || token != undefined && token) {

        const email = await verifyToken(token)
        if (email) {
            const user = await getUserByEmailComplety(email.email)
            if (user) {
                chats = await getAllChatsByBuyerId(user._id.toString())
                for (let chat of chats) {
                    const product = await getProductApproved(chat.productId.toString())
                    if (product) {
                        json.push({
                            photo: product.photo[0],
                            name: product.name,
                            idProduct: chat.productId.toString(),
                            countMessage: await countUnreadMessagesProductIdAndBuyerId(chat.productId.toString(),chat.buyerId.toString())
                        })
                    }
                }
                return {
                    props: {
                        ...(await serverSideTranslations(context.locale!, ['common'])),
                        json: json,
                        token:token
                    }
                }
            }
        } else {
            return { notFound: true }
        }
    } else {
        return { notFound: true }
    }
};

export default function admin(data: any) {
    console.log(data.json)
    const { t } = useTranslation("common");
    const [pressedButton, setPressedButton] = useState("products");
    const [activeSection, setActiveSection] = useState("products");

    const renderActiveSection = () => {
        switch (activeSection) {
            case "products":
                return (
                    <figure className="w-full content-center">
                        <ListChatWithProducts chats={data.json} token={data.token} />
                    </figure>
                );
            default:
                return null;
        }
    };

    return (
        <main className="h-screen">
            <Header />
            <section className="content-center h-full ml-10">
                <main className="flex">
                    <section className="flex-col justify-start items-end gap-4 inline-flex border-2 border-r-gray-200 border-t-white border-b-white border-l-white pr-2">
                        <button
                            className={`w-52 h-10 px-6 py-2 rounded-lg justify-start items-center gap-2.5 inline-flex ${pressedButton === "products" ? "bg-neutral-100" : ""
                                }`}
                            onClick={() => {
                                setPressedButton("products");
                                setActiveSection("products");
                            }}
                        >
                            <LuBox />
                            <div className="text-gray-600 text-sm font-medium font-['Inter'] leading-normal">
                                {t("products")}
                            </div>
                        </button>
                    </section>
                    {renderActiveSection()}
                </main>
            </section>
            <Footer />
        </main>
    );
}

