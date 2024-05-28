import Header from "../../lib/components/Header";
import React, { useState } from "react";
import Footer from "../../lib/components/Footer";
import { LuBox } from "react-icons/lu";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSidePropsContext } from "next";
import { parse } from "cookie";
import { verifyToken } from "../../lib/jsonwebtoken";
import ListProducts from "../../lib/components/ListProducts";
import { getUserByEmailComplety } from "../../lib/models/User";
import { getAllProductsByUserId } from "../../lib/models/Product";
import { countUnreadMessagesProductId } from "../../lib/models/Chat";

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
    countMessages: number;
};


export const getServerSideProps = async (context: GetServerSidePropsContext) => {

    const convertProductsToProducts = async (products: any[]): Promise<NewProduct[]> => {
        const convertedProducts: NewProduct[] = [];
        for (const product of products) {
            const countMessages = await countUnreadMessagesProductId(product._id.toString());
            convertedProducts.push({
                id: product._id.toString() || '',
                name: product.name,
                price: product.price,
                quantity: product.approved.toString(),
                categories: product.category,
                photo: product.photo[0] || "https://via.placeholder.com/150",
                countMessages: countMessages
            });
        }
        return convertedProducts;
    };

    const cookies = parse(context.req.headers.cookie || '');
    const token = cookies.token;
    let products: any[];

    if (token || token != "" && token || token != undefined && token) {

        const email = await verifyToken(token)
        if (email) {
            const user = await getUserByEmailComplety(email.email)
            if (user){
                const productss = await getAllProductsByUserId(user._id.toString())
                console.log(productss)
                if (productss) {
                    products = productss.map((product: { _id: { toString: () => any; }; }) => ({ ...product, _id: product._id ? product._id.toString() : '' }))
                  } else {
                    products = []
                  }
            return {
                props: {
                    ...(await serverSideTranslations(context.locale!, ['common'])),
                    products: await convertProductsToProducts(products),
                    token: token
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
    const { t } = useTranslation("common");
    const [pressedButton, setPressedButton] = useState("products");
    const [activeSection, setActiveSection] = useState("products");

    const renderActiveSection = () => {
        switch (activeSection) {
            case "products":
                return (
                    <figure className="w-full content-center">
                        <ListProducts products={data.products} token={data.token} />
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
function getAllProductById(arg0: string) {
    throw new Error("Function not implemented.");
}

