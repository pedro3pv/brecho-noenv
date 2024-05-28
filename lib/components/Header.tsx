import Image from "next/image";
import { FaUser } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'next-i18next';
import { useRouter } from "next/router";
import { IoSearch } from "react-icons/io5";

const Header = () => {
  const loop = true
  const animatedText = 'Buscar Produtos';
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const { t } = useTranslation('common');
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');

  function handleSearch(){
    let encodedInputValue = encodeURIComponent(inputValue);
    router.push("/products?page=1&text=" + encodedInputValue);
}

  const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputValue(event.target.value);
  };

  if (!loop) {
    useEffect(() => {
      const interval = setInterval(() => {
        if (index < animatedText.length) {
          setDisplayedText((prev) => prev + animatedText[index]);
          setIndex((prev) => prev + 1);
        }

        if (index === animatedText.length - 1) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }, [index, animatedText]);
  } else {
    useEffect(() => {
      const interval = setInterval(() => {
        if (index < animatedText.length) {
          setDisplayedText((prev) => prev + animatedText[index]);
          setIndex((prev) => prev + 1);
        }
      }, 100);

      if (index === animatedText.length) {
        setTimeout(() => {
          setDisplayedText('');
          setIndex(0);
        }, 1000);
      }

      return () => clearInterval(interval);
    }, [index, animatedText]);
  }
  return (
    <header className="header w-full h-fit bg-white text-neutral-black-b900 py-4">
      <div className="container mx-auto max-w-6xl flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <a href="/" className="flex items-center space-x-4 font-bold text-xl text-green-800">
            <Image src="/logo.svg" alt="Logo" width={45} height={45} />
            Brechó Unifor</a>
        </div>
        <nav className="flex space-x-8">
        <a href="/">Inicio</a>
          <a href="/products?page=1">Produtos</a>
          <a href="/about">Sobre</a>
          <a href="/contact">Contate-nos</a>
        </nav>
        <div className="flex space-x-4 items-center">
          <button onClick={handleSearch}>
            <IoSearch size={24}/>
            </button>
          <input
            type="text"
            className="border rounded p-2"
            placeholder={displayedText}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <button onClick={() => router.push('/user/account')}>
            <FaUser size={24} className="ml-8" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header