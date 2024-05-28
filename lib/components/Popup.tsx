import { serialize } from 'cookie';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

type PopupProps = {
    togglePopup: (event: React.MouseEvent<HTMLElement>) => void;
};



export const Popup = ({ togglePopup }: PopupProps) => {
    const { t } = useTranslation('common');
    const router = useRouter();

function logout() {
    
        document.cookie = serialize('token', "", {
            path: '/',
            httpOnly: false,
            secure: process.env.NODE_ENV !== 'development', // secure in production
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        router.push('/user/login');
}

 return(
    <div className="fixed top-0 left-0 z-50 w-screen h-screen bg-black bg-opacity-75">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white p-10 rounded-md">
            <div className="bg-powderblue p-4 cursor-pointer text-center flex-row">
            <div className="text-zinc-600 text-sm font-normal font-['Inter'] leading-normal mb-6">{t("youWantToLogOut")} ?
                    </div>
                    <div className='flex justify-center'>
                        <button
                className="w-26 h-11 px-6 py-3 mr-2 bg-gray-900 rounded gap-1.5 text-white text-sm font-medium leading-normal"
                    type="submit" onClick={logout}>{t("yes")}
                </button>
                <button
                className="w-26 h-11 px-6 py-3 ml-2 bg-gray-900 rounded gap-1.5 text-white text-sm font-medium leading-normal"
                    type="submit" onClick={togglePopup}>{t("no")}
                </button>
                </div>
            </div>
        </div>
    </div>
);

}
export default Popup