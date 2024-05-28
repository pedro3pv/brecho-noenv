import React, { useState, FormEvent } from 'react';
import {useTranslation} from "next-i18next";
import {GetServerSidePropsContext} from "next";
import {parse} from "cookie";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import Header from "../../../lib/components/Header";
import Footer from '../../../lib/components/Footer';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    return {
        props: {
            ...(await serverSideTranslations(context.locale!, ['common']))
        }
    }
};

export default function ResetPasswordRequest() {
    const [errorMessage, setErrorMessage] = useState("");
    const { t } = useTranslation('common');

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data2 = Object.fromEntries(formData.entries());

        const response = await fetch('/api/user/resetPasswordRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: data2.email }),
        });

        const data = await response.json();

        if (data.error == "Email não encontrado.") {
            setErrorMessage(t("emailNotFound"));
        } else if (data.error == "Método não permitido."){
            setErrorMessage(t("methodNotPermitted"));
        } else if (data.error) {
            setErrorMessage(t("unknownErrorPleaseContactSupport"))
        }
    }

    return (
        <main className={"h-screen w-screen"}>
            <Header/>
            <section className={"flex items-center justify-center h-full"}>
                <form onSubmit={onSubmit} className={"flex flex-col space-y-4 p-4"}>
                    <div className="w-80 text-zinc-600 text-sm font-normal font-['Inter'] leading-normal">{t("pleaseEnterTheEmailAddressAssociatedWithYourAccountWeLlPromptlySendYouALinkToResetYourPassword")}
                    </div>
                    <div className="text-zinc-600 text-sm font-medium leading-normal">{t('email')}</div>
                    <input
                        className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                        name={"email"} type={"email"}/>
                    {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
                    <button
                        className="w-80 h-11 px-6 py-3 bg-gray-900 rounded gap-1.5 text-white text-sm font-medium leading-normal"
                        type="submit">{t("sendResetLink")}
                    </button>
                </form>
            </section>
            <Footer/>
        </main>
    );
}