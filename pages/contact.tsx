import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Header from "../lib/components/Header";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Footer from "../lib/components/Footer";

export const getServerSideProps = async ({ locale }: GetServerSidePropsContext) => ({
    props: {
        ...(await serverSideTranslations(locale!, ['common']))
    }
});

export default function Contact() {
    const members = [
        { name: "Pedro Arthur Rodrigues", github: "https://github.com/pedroarodriguesg" },
        { name: "Pedro Augusto de Oliveira Neto", github: "https://github.com/pedro3pv" },
        { name: "Felipe Ben-hur", github: "https://github.com/felipebenhur" },
        { name: "Gustavo Gadelha Sales", github: "https://github.com/GustavoGadelhaa" },
        { name: "Murilo Girão", github: "https://github.com/MuriloGirao" }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />
            <main className="flex-grow flex flex-col items-center">
                <h1 className="text-3xl font-bold text-green-800 mt-8">Participantes</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 px-4 w-full max-w-5xl">
                    {members.slice(0, 2).map((member, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
                            <div className="bg-black text-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-semibold text-center">{member.name}</h2>
                            <a href={member.github} className="text-blue-500 hover:underline mt-2">GitHub</a>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 px-4 w-full max-w-5xl">
                    {members.slice(2).map((member, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
                            <div className="bg-black text-white rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-semibold text-center">{member.name}</h2>
                            <a href={member.github} className="text-blue-500 hover:underline mt-2">GitHub</a>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
