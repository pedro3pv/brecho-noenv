import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Header from "../../lib/components/Header";
import React, { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { parse, serialize } from "cookie";
import { verifyToken } from "../../lib/jsonwebtoken";
import { getUserByEmailComplety } from "../../lib/models/User";
import Footer from "../../lib/components/Footer";
import { GrAddCircle } from "react-icons/gr";
import {
    LuKeyRound,
    LuLogOut,
    LuPackage,
    LuUserCircle2,
} from "react-icons/lu";
import { useTranslation } from "next-i18next";
import Popup from "../../lib/components/Popup";
import { useRouter } from "next/router";
import { BsChatDots } from "react-icons/bs";
import { countUnreadMessagesBuyerId, countUnreadMessagesSellerId } from "../../lib/models/Chat";

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const { req, res } = context;
    const cookies = parse(context.req.headers.cookie || "");
    const token = cookies.token;
    let response = null;
    let user = null;
    let unreadMessagesSellerId = 0
    let unreadMessagesBuyerId = 0

    if (!token || token == "") {
        return {
            redirect: {
                destination: "/user/login",
                permanent: false,
            },
        };
    } else {
        response = await verifyToken(token);

        if (response != null) {
            let parsedBody;
            if (typeof response === "string") {
                parsedBody = JSON.parse(response);
            } else {
                parsedBody = response;
            }
            user = await getUserByEmailComplety(parsedBody["email"]);
            unreadMessagesSellerId = await countUnreadMessagesSellerId(user!._id.toString());
            unreadMessagesBuyerId = await countUnreadMessagesBuyerId(user!._id.toString());
            delete (user as { _id?: any })._id;
        } else {
            res.setHeader('Set-Cookie', serialize('token', "", {
                path: '/',
                httpOnly: false,
                secure: process.env.NODE_ENV !== 'development', // secure in production
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            }));
            return {
                redirect: {
                    destination: '/user/login',
                    permanent: false,
                }
            }
        }
    }
    return {
        props: {
            ...(await serverSideTranslations(context.locale!, ["common"])),
            user: user,
            token: token,
            sellerIdCount: unreadMessagesSellerId < 99 ? unreadMessagesSellerId : "99+",
            buyerIdCount: unreadMessagesBuyerId < 99 ? unreadMessagesBuyerId : "99+",
        },
    };
};

export default function account({
    user,
    token,
    sellerIdCount,
    buyerIdCount
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const { t } = useTranslation("common");
    const [pressedButton, setPressedButton] = useState("account detail");
    const [activeSection, setActiveSection] = useState("account detail");
    const [isShowPopup, setIsShowPopup] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const router = useRouter();

    const togglePopup = () => {
        setIsShowPopup(!isShowPopup);
    };

    const sendNewPassword = () => {
        if (password == confirmPassword) {
            const json = {
                token: token,
                password: password,
            };
            const response = fetch("/api/user/updatePassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(json),
            });
            document.cookie = serialize("token", "", {
                path: "/",
                httpOnly: false,
                secure: process.env.NODE_ENV !== "development", // secure in production
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7, // 1 week
            });
            router.push("/user/login");
        } else {
            setErrorMessage(t("passwordsAreNotTheSame"));
        }
    };

    if (user != null) {
        const renderActiveSection = () => {
            switch (activeSection) {
                case "password":
                    return (
                        <figure className="w-full content-center p-1">
                            <div>
                                <form className={"flex flex-col space-y-4 p-4 w-fit "}>
                                    <div className="text-gray-900 text-base font-semibold font-['Inter']">
                                        {t("redefinePassword")}
                                        <div className="text-zinc-600 text-sm font-medium leading-normal mt-4">
                                            {t("newPassword")}
                                        </div>
                                        <input
                                            className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                                            name={"password"}
                                            type={"password"}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />

                                        <div className="text-zinc-600 text-sm font-medium leading-normal mt-4">
                                            {t("confirmPassword")}
                                        </div>
                                        <input
                                            className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                                            name={"confirmPassword"}
                                            type={"password"}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        {errorMessage && (
                                            <p className="text-red-500 text-xs">{errorMessage}</p>
                                        )}
                                        <div className="w-full content-center mt-4">
                                            <button
                                                className="w-44 h-11 px-6 py-3 bg-gray-900 rounded gap-1.5 text-white text-sm  leading-normal font-semibold font-['Inter'] "
                                                type="submit"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    sendNewPassword();
                                                }}
                                            >
                                                {t("saveChanges")}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </figure>
                    );
                case "account detail":
                    return (
                        <figure className={"w-full content-center"}>
                            <form className={"flex flex-col space-y-4 p-4"}>
                                <div className="text-gray-900 text-base font-semibold font-['Inter']">
                                    {t("accountDetails")}
                                </div>
                                <div className="text-zinc-600 text-sm font-medium leading-normal">
                                    {t("name")}
                                </div>
                                <input
                                    className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                                    name={"name"}
                                    type={"text"}
                                    defaultValue={user.name}
                                    readOnly
                                />
                                <div className="text-zinc-600 text-sm font-medium leading-normal">
                                    {t("email")}
                                </div>
                                <input
                                    className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                                    name={"email"}
                                    type={"email"}
                                    defaultValue={user.email}
                                    readOnly
                                />
                                {/* <button
                                    className="w-44 h-11 px-6 py-3 bg-gray-900 rounded gap-1.5 text-white text-sm font-medium leading-normal"
                                >
                                    {t("saveChanges")}
                                </button> */}
                            </form>
                        </figure>
                    );
                default:
                    return null;
            }
        };

        return (
            <main className="h-screen">
                <Header />
                <section className="content-center h-full ml-10 flex items-center justify-center">
                    <main className="flex">
                        {isShowPopup && <Popup togglePopup={togglePopup} />}
                        <section className="flex-col justify-start items-end gap-4 inline-flex border-2 border-r-gray-200 border-t-white border-b-white border-l-white pr-2">
                            <button className={`w-52 h-10 px-6 py-2 rounded-lg justify-start items-center gap-2.5 inline-flex bg-neutral-100`} onClick={() => { router.push('/user/product/addproduct') }} > <GrAddCircle />
                                <div className="text-gray-600 text-sm font-medium font-['Inter'] leading-normal">Adicionar Produto </div>
                            </button>
                            <button className={`w-52 h-10 px-6 py-2 rounded-lg justify-start items-center gap-2.5 inline-flex bg-neutral-100`} onClick={() => router.push('/user/myproducts')}>
                                <LuPackage />
                                <div className="flex items-center">
                                    <div className="text-gray-600 text-sm font-medium font-['Inter'] leading-normal">Lista De Produtos </div>
                                    {(Number(sellerIdCount) > 0 || sellerIdCount == "99+") &&
                                        <div className="ml-2 bg-red-500 text-white text-sm font-medium font-['Inter'] leading-normal rounded-full w-6 h-6 flex items-center justify-center">{sellerIdCount}</div>
                                    }
                                </div>
                            </button>
                            <button className={`w-52 h-10 px-6 py-2 rounded-lg justify-start items-center gap-2.5 inline-flex bg-neutral-100`} onClick={() => router.push('/user/mychats')}> <BsChatDots />
                                <div className="flex items-center">
                                    <div className="text-gray-600 text-sm font-medium font-['Inter'] leading-normal">Lista De Chats </div>
                                    {(Number(buyerIdCount) > 0 || buyerIdCount == "99+")&&
                                        <div className="ml-2 bg-red-500 text-white text-sm font-medium font-['Inter'] leading-normal rounded-full w-6 h-6 flex items-center justify-center">{buyerIdCount}</div>
                                    }
                                </div>
                            </button>
                            <button
                                className={`w-52 h-10 px-6 py-2 rounded-lg justify-start items-center gap-2.5 inline-flex ${pressedButton === "password" ? "bg-neutral-100" : ""
                                    }`}
                                onClick={() => {
                                    setPressedButton("password");
                                    setActiveSection("password");
                                }}
                            >
                                <LuKeyRound />
                                <div className="text-gray-600 text-sm font-medium font-['Inter'] leading-normal">
                                    {t("password")}
                                </div>
                            </button>
                            <button
                                className={`w-52 h-10 px-6 py-2 rounded-lg justify-start items-center gap-2.5 inline-flex ${pressedButton === "account detail" ? "bg-neutral-100" : ""
                                    }`}
                                onClick={() => {
                                    setPressedButton("account detail");
                                    setActiveSection("account detail");
                                }}
                            >
                                <LuUserCircle2 />
                                <div className="text-gray-600 text-sm font-medium font-['Inter'] leading-normal">
                                    {t("accountDetails")}
                                </div>
                            </button>
                            <button
                                className={`w-52 h-10 px-6 py-2 rounded-lg justify-start items-center gap-2.5 inline-flex ${pressedButton === "logout" ? "bg-neutral-100" : ""
                                    }`}
                                onClick={() => {
                                    togglePopup();
                                }}
                            >
                                <LuLogOut />
                                <div className="text-gray-600 text-sm font-medium font-['Inter'] leading-normal">
                                    Logout
                                </div>
                            </button>
                        </section>
                        {renderActiveSection()}
                    </main>
                </section>
                <Footer />
            </main>
        );
    } else {
        return <a>erro</a>;
    }
}
