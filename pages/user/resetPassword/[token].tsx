import { useRouter } from 'next/router';
import React, { useState, FormEvent } from 'react';
import { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { parse } from "cookie";
import { verifyToken } from "../../../lib/jsonwebtoken";
import { getUserByEmailComplety } from "../../../lib/models/User";
import { ParsedUrlQuery } from "node:querystring";
import Header from "../../../lib/components/Header";
import { useTranslation } from "next-i18next";
import Footer from '../../../lib/components/Footer';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const cookies = parse(context.req.headers.cookie || '');
    const token = cookies.token;
    const parsedUrlQuery: ParsedUrlQuery = context.query;
    let response = null;
    let user = null;

    let tokenReset: string | string[] | undefined = parsedUrlQuery['token'];

    if (Array.isArray(tokenReset)) {
        tokenReset = tokenReset[0];
    }

    if (tokenReset) {
        tokenReset = tokenReset.toString();
        response = verifyToken(tokenReset);
    }

    if (token || token != "" && token || token != undefined && token) {
        return {
            redirect: {
                destination: '/user/account',
                permanent: false,
            },
        }
    }

    if (response != null) {
        let parsedBody;
        if (typeof response === 'string') {
            parsedBody = JSON.parse(response);
        } else {
            parsedBody = response;
        }
        user = await getUserByEmailComplety(parsedBody["email"])
        if (user) {
            if (user.resetPasswordToken != tokenReset) {
                return {
                    redirect: {
                        destination: '/user/resetPassword',
                        permanent: false,
                    },
                }
            }
        }
    } else {
        return {
            redirect: {
                destination: '/user/resetPassword',
                permanent: false,
            },
        }
    }

    if (user) {
        if (user.resetPasswordToken != tokenReset) {
            return {
                redirect: {
                    destination: '/user/account',
                    permanent: false,
                },
            }
        }
    }

    return {
        props: {
            ...(await serverSideTranslations(context.locale!, ['common']))
        }
    }
};

export default function ResetPassword() {
    const router = useRouter();
    const { token } = router.query;

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { t } = useTranslation('common');

    async function onSubmit(event: FormEvent) {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const response = await fetch('/api/user/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, password }),
        });

        const data = await response.json();

        if (data.error) {
            console.error(data.error);
        } else {
            router.push('/user/login');
        }
    }

    return (
        <main className={"h-screen w-screen"}>
            <Header />
            <section className={"flex items-center justify-center h-full"}>
                <form onSubmit={onSubmit} className={"flex flex-col space-y-4 p-4"}>
                    <div className="text-zinc-600 text-sm font-medium leading-normal">{t("newPassword")}</div>
                    <input
                        className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <div className="text-zinc-600 text-sm font-medium leading-normal">{t("confirmPassword")}</div>
                    <input
                        className="w-80 h-11 px-3.5 py-2.5 rounded-md border border-gray-200 justify-start items-center gap-2 inline-flex"
                        type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        required />
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    <button
                        className="w-80 h-11 px-6 py-3 bg-gray-900 rounded gap-1.5 text-white text-sm font-medium leading-normal"
                        type="submit">{t("redefinePassword")}
                    </button>
                </form>
            </section>
            <Footer />
        </main>
    )
        ;
}