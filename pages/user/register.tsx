import {GetServerSidePropsContext} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {FormEvent, useEffect, useState} from "react";
import Header from "../../lib/components/Header";
import {User} from "../../lib/models/User";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import {parse} from "cookie";
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

export default function register() {
    const { t } = useTranslation('common');
    const [errorMessage, setErrorMessage] = useState("");

    const router = useRouter();

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData.entries());

        for (let key in data) {
            if (data[key] === '') {
                setErrorMessage(`${t("pleaseFillInTheField")} ${t(key)}`);
                return;
            }
        }

        const user : User = {
            name: data["name"] as string,
            lastName: data["lastName"] as string,
            email: data["email"] as string,
            password: data["password"] as string,
            cpf: Number(data["id"]),
            phone: Number(data["phone"])
        };

        const response = await fetch('/api/user/register', {
            method: 'POST',
            body: JSON.stringify(user),
        })

        const result = await response.json()

        if (result.message === 'Registered successfully'){
            router.push('/user/login');
        }
        if (result.message === 'Email is already registered'){
            setErrorMessage(`${t('emailIsAlreadyRegistered')}`);
        }
    }

    return (
        <div className={"h-screen w-screen"}>
            <Header/>
            <section className={"flex items-center justify-center h-full"}>
                <form onSubmit={onSubmit} className={"flex flex-col space-y-4 p-4 items-center"}>
                    <div className={"flex flex-row items-center"}>
                        <div className={"mr-10"}>
                            <div className="text-zinc-600 text-sm font-medium leading-normal">{t('name')}</div>
                            <input
                                className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                                name={"name"} type={"text"}/>
                            <div className="text-zinc-600 text-sm font-medium leading-normal">{t('lastName')}</div>
                            <input
                                className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                                name={"lastName"} type={"text"}/>
                            <div className="text-zinc-600 text-sm font-medium leading-normal">{t('email')}</div>
                            <input
                                className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                                name={"email"} type={"email"}/>
                            <div className="text-zinc-600 text-sm font-medium leading-normal">{t('password')}</div>
                            <input
                                className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                                name={"password"} type={"password"}/>
                            <div className="text-zinc-600 text-sm font-medium leading-normal">{t('phone')}</div>
                            <input
                                className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                                name={"phone"} type={"text"}/>
                            <div className="text-zinc-600 text-sm font-medium leading-normal">{t('id')}</div>
                            <input
                                className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                                name={"id"} type={"number"}/>
                        </div>
                    </div>
                    {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
                    <div
                        className="py-4 w-80 h-12 text-gray-600 text-xs font-medium font-['Inter'] capitalize leading-normal">{t('byCreatingAnAccountYouAgreeWithOurTermsOfServicePrivacyPolicy')}<br/>
                    </div>
                    <button
                        className="w-80 h-11 px-6 py-3 bg-gray-900 rounded gap-1.5 text-white text-sm font-medium leading-normal"
                        type="submit">{t('createAccount')}
                    </button>
                    <a href={"/user/login"} className="text-gray-600 text-sm font-normal font-['Inter'] leading-normal">{t("alreadyHaveAnAccountLogIn")}
                    </a>
                </form>
            </section>
            <Footer/>
        </div>
    );
}