import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import React, {FormEvent, useState} from "react";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import Header from "../../lib/components/Header";
import {parse, serialize} from 'cookie';
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import Footer from "../../lib/components/Footer";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const cookies = parse(context.req.headers.cookie || '');
    const token = cookies.token;

    if (token || token != "" && token || token != undefined && token) {
        return {
            redirect: {
                destination: '/user/account',
                permanent: false,
            },
        }
    }

    return {
        props: {
            ...(await serverSideTranslations(context.locale!, ['common']))
        }
    }
};

export default function login() {
    const router = useRouter();
    const { t } = useTranslation('common');
    const [errorMessage, setErrorMessage] = useState("");

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/api/user/login', {
            method: 'POST',
            body: JSON.stringify(data),
        })

        const result = await response.json()
        if (result['error'] == "User not found") {
            setErrorMessage(t("emailNotFound"));
        }
        if (result['error'] == "Invalid password"){
            setErrorMessage(t("invalidPassword"));
        }
        if (result['error'] == "User Banido"){
            setErrorMessage("Usuario Banido");
        }
        if (result['token']) {
            document.cookie = serialize('token', result['token'], {
                path: '/',
                httpOnly: false,
                secure: process.env.NODE_ENV !== 'development', // secure in production
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });
            await router.push('/user/account');
        }
    }

    return (
        <main className={"h-screen w-screen"}>
            <Header/>
            <section className={"flex items-center justify-center h-full"}>
                <form onSubmit={onSubmit} className={"flex flex-col space-y-4 p-4"}>
                    <div className="text-zinc-600 text-sm font-medium leading-normal">{t('email')}</div>
                    <input
                        className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                        name={"email"} type={"email"}/>
                    <div className="text-zinc-600 text-sm font-medium leading-normal">{t('password')}</div>
                    <input
                        className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                        name={"password"} type={"password"}/>
                    {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
                    <a href={"/user/resetPassword"}
                       className="text-zinc-600 text-xs font-medium font-['Inter'] capitalize leading-normal">{t("iForgotMyPassword")}
                    </a>
                    <button
                        className="w-80 h-11 px-6 py-3 bg-gray-900 rounded gap-1.5 text-white text-sm font-medium leading-normal"
                        type="submit">{t("login")}
                    </button>
                    <a href={"/user/register"} className="text-gray-600 text-sm font-normal font-['Inter'] leading-normal self-center">{t("createAccount")}</a>
                </form>
            </section>
            <Footer/>
        </main>
    );
}