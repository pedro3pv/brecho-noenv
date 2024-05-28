import { useTranslation } from "next-i18next";
import { LuFacebook, LuInstagram, LuGithub } from "react-icons/lu";
import styles from '../style/footer.module.css';

const Footer = () => {
    const { t } = useTranslation('common');
    return (
        <footer className="footer bg-neutral-white-w100 py-16 text-gray-600">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-wrap justify-between">
                    <div className="w-full lg:w-1/4 mb-8 lg:mb-0">
                        <h3 className="font-semibold mb-4">BRECHÓ UNIFOR</h3>
                        <ul>
                            <li>Sobre Nós</li>
                            <li>Contato</li>
                        </ul>
                    </div>
                    <div className="w-full lg:w-1/4 mb-8 lg:mb-0">
                        <h3 className="font-semibold mb-4">SUPORTE</h3>
                        <ul>
                            <li>FAQ</li>
                            <li>Termos de Uso</li>
                        </ul>
                    </div>
                    <div className="w-full lg:w-1/4 mb-8 lg:mb-0">
                        <h3 className="font-semibold mb-4">SHOP</h3>
                        <ul>
                            <li>Minha Conta</li>
                            <li>Produtos</li>
                        </ul>
                    </div>
                    <div className="w-full lg:w-1/4">
                        <h3 className="font-semibold mb-4">REDES SOCIAIS</h3>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <LuFacebook className="h-6 w-6" />
                            </a>
                            <a href="https://www.instagram.com/uniforcomunica/?hl=pt-br" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <LuInstagram className="h-6 w-6" />
                            </a>
                            <a href="https://github.com/pedro3pv" target="_blank" rel="noopener noreferrer" aria-label="Github">
                                <LuGithub className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center text-gray-400">
                    © 2024 Brechó Unifor. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
