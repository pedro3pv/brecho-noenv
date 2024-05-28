import React, { useState, useCallback, FormEvent } from "react";
import { BsChatDots } from "react-icons/bs";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from "@nextui-org/react";
import { LuPlus } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FaRegTrashCan } from "react-icons/fa6";

const columns = [
  { uid: "photo", name: "Foto" },
  { uid: "name", name: "Nome" },
  { uid: "price", name: "Preço" },
  { uid: "quantity", name: "Aprovado" },
  { uid: "categories", name: "Categorias" },
  { uid: "actions", name: "Ações" },
];

// const products = [
//   {
//     id: 1,
//     name: "Produto 1",
//     price: 29.99,
//     quantity: 100,
//     categories: "Categoria A, Categoria B",
//     photo: "https://via.placeholder.com/150",
//   },
//   {
//     id: 2,
//     name: "Produto 2",
//     price: 59.99,
//     quantity: 50,
//     categories: "Categoria C",
//     photo: "https://via.placeholder.com/150",
//   },
// ];

// type Product = typeof products[number];

function ListProducts(data: any) {
  const products = data.products
  const { t } = useTranslation("common");
  const router = useRouter();
  const token = data.token

  const handleAddProductClick = () => {
    router.push("/user/product/addproduct");
  };

  async function chats(productId: string) {
    const path = ("/user/chats/" + productId)
    router.push(path);
  }

  async function deleteProduct(productId: string) {

    const json = {
      token: token,
      id: productId
    }

    const response = await fetch('/api/user/product/deleteProduct', {
      method: 'POST',
      body: JSON.stringify(json),
    })

    router.reload();
  }

  const renderCell = useCallback((product, columnKey: React.Key) => {
    const cellValue = product[columnKey];

    switch (columnKey) {
      case "photo":
        return <img src={String(cellValue)} alt="Product" className="h-16 w-16 object-cover rounded-md mx-auto mt-4" />;
      case "name":
        return <p className="text-center">{cellValue}</p>;
      case "price":
        return <p className="text-center">R${cellValue}</p>;
      case "quantity":
        return <p className="text-center">{cellValue}</p>;
      case "categories":
        return <p className="text-center">{cellValue}</p>;
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip content="Chats">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50 p-3 rounded-md hover:bg-black hover:text-white"
                onClick={() => chats(product.id)}
              >
                <BsChatDots />
              </span>
            </Tooltip>
            <Tooltip content="Apagar Produto">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50 p-3 rounded-md hover:bg-black hover:text-white"
                onClick={() => deleteProduct(product.id)}
              >
                <FaRegTrashCan color="red" />
              </span>
            </Tooltip>
            {(product.countMessages > 0) &&
              <div className="ml-2 bg-red-500 text-white text-sm font-medium font-['Inter'] leading-normal rounded-full w-6 h-6 flex items-center justify-center">{product.countMessages}</div>
            }
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="bg-gray-300 p-6 h-screen">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold ml-4 mt-4">{t("products")}</h2>
          <div className="flex items-center">
            <button
              onClick={handleAddProductClick}
              className={`inline-flex items-center px-6 py-3 bg-gray-900 rounded gap-1.5 text-white text-sm font-medium leading-normal transform hover:scale-105 relative focus:outline-none`}
              style={{ transition: "transform 0.3s" }}
            >
              <span>{t("addproduct")}</span>
              <span>
                <LuPlus size={22} strokeWidth={2} />
              </span>
            </button>
          </div>
        </div>
        <Table aria-label="Tabela de produtos">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} className="border-t-2 border-b-2">
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={products}>
            {(item: any) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell className="text-center">{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ListProducts;
