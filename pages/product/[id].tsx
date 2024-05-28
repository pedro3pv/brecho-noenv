import { useRouter } from "next/router";
import React, { useState, FormEvent } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { ParsedUrlQuery } from "node:querystring";
import Header from "../../lib/components/Header";
import { useTranslation } from "next-i18next";
import Footer from "../../lib/components/Footer";
import { getProductApproved } from "../../lib/models/Product";
import { Card, CardBody, cn, PaginationItemType, Tab, Tabs, usePagination } from "@nextui-org/react";
import { ChevronIcon } from "../../lib/components/ChevronIcon";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { parse } from "cookie";
import { verifyToken } from "../../lib/jsonwebtoken";


export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const parsedUrlQuery: ParsedUrlQuery = context.query;
  const productId: string | string[] | undefined = parsedUrlQuery["id"];
  const cookies = parse(context.req.headers.cookie || '');
  let token = cookies.token;

  if (token) {
    if (!(verifyToken(token))) {
      token = "";
    }
  } else {
    token = "";
  }

  if (typeof productId === "string") {
    const product = await getProductApproved(productId);

    if (product) {
      return {
        props: {
          ...(await serverSideTranslations(context.locale!, ['common'])),
          product: {
            ...product,
            _id: product._id.toString(),
            photo: product.photo,
            description: product.description,
            name: product.name,
            price: product.price
          },
          token: token
        },
      };
    }
    return { notFound: true };
  }
};

export default function product({
  product,
  token
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const isVertical = true;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation("common");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const response = await fetch("/api/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
    } else {
      router.push("/user/login");
    }
  }

  function sendToChat(){
    if (token != ""){
    router.push('/user/chat?idProduct='+product._id)
  } else {
    router.push('/user/login')
  }
  }

  const { activePage, range, setPage, onNext, onPrevious } = usePagination({
    total: product.photo.length,
    showControls: true,
    siblings: 10,
    boundaries: 10,
  });

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto p-4 flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-8">
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <img
            className="w-full max-w-xs h-auto rounded-lg shadow-md"
            src={product.photo[activePage - 1]}
            alt={product.name}
          />
          <div className="flex space-x-2 mt-4">
            {range.map((page) => {
              if (page === PaginationItemType.NEXT) {
                return (
                  <button
                    key={page}
                    aria-label="next page"
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                    onClick={onNext}
                  >
                    <ChevronIcon className="rotate-180" />
                  </button>
                );
              }
              if (page === PaginationItemType.PREV) {
                return (
                  <button
                    key={page}
                    aria-label="previous page"
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                    onClick={onPrevious}
                  >
                    <ChevronIcon />
                  </button>
                );
              }
              if (page === PaginationItemType.DOTS) {
                return (
                  <div
                    key={page}
                    className="w-8 h-8 flex items-center justify-center"
                  >
                    ...
                  </div>
                );
              }
              return (
                <button
                  key={page}
                  aria-label={`page ${page}`}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${activePage === page ? "bg-gray-800 text-white" : "bg-gray-200"
                    }`}
                  onClick={() => setPage(page)}
                >
                  {page}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-8 border-2 border-gray-300 rounded-md p-3">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-lg font-bold text-gray-600">
            {"R$" + product.price.toFixed(2)}
          </p>
          <div className="flex space-x-4">
            <button className="w-full md:w-auto bg-gray-900 text-white text-sm font-medium rounded-md p-3" onClick={sendToChat}>
              Conversar Com Vendedor
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col px-4">
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options" isVertical={isVertical}>
            <Tab key="details" title={t("Details")}>
              <Card>
                <CardBody>
                  {product.description}
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
      <Footer />
    </main>
  );
}
