import React, { useState, useEffect } from 'react';
import Header from '../lib/components/Header';
import Footer from '../lib/components/Footer';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getAllProductsApproved } from '../lib/models/Product';
import { useRouter } from 'next/router';
import { WithId } from 'mongodb';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  function convertIdsToString(products: any[]) {
    const productss = products.map(product => ({ ...product, _id: product._id.toString() }));
    return productss.map(product => ({ ...product, photo: product.photo[0] }));
  }
  let products = await getAllProductsApproved(0);
  let productss = convertIdsToString(products);
  const slicedProducts = productss.slice(0, 4);
  return {
    props: {
      products: slicedProducts
    }
  }
};

const Homepage = ({ products }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  return (
    <div className="homepage w-full bg-white text-left font-body-regular text-neutral-black-b900">
        <Header/>

      <div className="hero w-full bg-neutral-white-w100 py-16 relative">
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-semibold text-neutral-black-b800">
              Novidades Brechó
            </h1>
            <p className="mt-4 text-neutral-black-b600">
              Veja as peças.
            </p>
            <button className="mt-6 bg-green-800 text-white py-2 px-4 rounded" onClick={() => router.push('/products?page=1')}>
              Ver mais
            </button>
          </div>
          <img
            src="https://cdn-icons-png.flaticon.com/512/11029/11029302.png"
            alt="Hero Image"
            className="h-96"
          />
        </div>
        <div className="absolute top-20 right-20 w-80 h-80 bg-neutral-white-w200 rounded-full opacity-60"></div>
      </div>

      <section className="features py-16">
        <div className="container mx-auto max-w-6xl flex justify-between space-x-8">
          <div className="feature-item text-center flex-1">
            <img src="img/planeta-terra.png" alt="Sustainability" className="mx-auto h-10 mb-4" />
            <h2 className="font-semibold text-lg">Sustentabilidade</h2>
            <p className="mt-2 text-gray-600">
              Nosso projeto de brechó sustentável é uma celebração do estilo consciente e da renovação da moda. Com uma abordagem inovadora, estamos comprometidos em promover a sustentabilidade ambiental.
            </p>
          </div>
          <div className="feature-item text-center flex-1">
            <img src="img/planejamento-de-tarefas.png" alt="Verified Products" className="mx-auto h-10 mb-4" />
            <h2 className="font-semibold text-lg">Produtos Verificados</h2>
            <p className="mt-2 text-gray-600">
              Em nosso brechó cada item passa por uma rigorosa inspeção para garantir sua qualidade e condição impecável. Acreditamos em dar uma segunda vida a peças de qualidade.
            </p>
          </div>
          <div className="feature-item text-center flex-1">
            <img src="img/forma-de-pagamento.png" alt="Secure Payment" className="mx-auto h-10 mb-4" />
            <h2 className="font-semibold text-lg">Negociação Segura</h2>
            <p className="mt-2 text-gray-600">
              Negocie diretamente com o comprador. Seus pagamentos estão seguros conosco. Com tecnologia de ponta e equipe especializada, garantimos a proteção total dos seus dados e transações.
            </p>
          </div>
        </div>
      </section>

      <section className="products py-16 bg-gray-100">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold mb-8 text-center">Veja nossos produtos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <button onClick={() => router.push("/product/"+product._id)}>
                <div className="product-card bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-start">
                <img src={product.photo} alt={product.name} className="w-full h-56 object-cover rounded-lg mb-4" />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <div className="mt-2 flex items-center">
                  <span className="bg-green-100 text-green-700 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">IN STOCK</span>
                  <span className="text-gray-900">{"R$"+product.price.toFixed(2)}</span>
                </div>
              </div>
              </button>
            ))}
          </div>
        </div>
      </section>
      <Footer/>
    </div>
    
  );
};

export default Homepage;
