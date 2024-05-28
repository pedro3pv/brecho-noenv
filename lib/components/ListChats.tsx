import React, { useCallback } from "react";
import { BsChatDots } from "react-icons/bs";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from "@nextui-org/react";
import { LuPlus } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const columns = [
  { uid: "name", name: "Nome" },
  { uid: "email", name: "Email" },
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

function ListChats(data: any) {
  const chatss = data.chats
  const { t } = useTranslation("common");
  const router = useRouter();

  const handleAddProductClick = () => {
    router.push("/user/product/addproduct");
  };

  async function chats(productId: string,buyerId: string) {
    const path = ("/user/chat?idProduct="+productId+"&idUser="+buyerId)

    const json = {
      token: data.token,
      productId: productId,
      buyerId: buyerId
    }

    const response = await fetch('/api/user/readMessages', {
      method: 'POST',
      body: JSON.stringify(json),
  })

    router.push(path);
  }

  const renderCell = useCallback((chatss, columnKey: React.Key) => {
    const cellValue = chatss[columnKey];

    switch (columnKey) {
      case "name":
        return <p className="text-center">{cellValue}</p>;
      case "email":
          return <p className="text-center">{cellValue}</p>;
      case "actions":
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip content="Chats">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50 p-3 rounded-md hover:bg-black hover:text-white"
              onClick={() => chats(chatss.idProduct,chatss.buyerId)}
              >
                <BsChatDots />
              </span>
            </Tooltip>
            {(chatss.countMessage > 0) &&
              <div className="ml-2 bg-red-500 text-white text-sm font-medium font-['Inter'] leading-normal rounded-full w-6 h-6 flex items-center justify-center">{chatss.countMessage}</div>
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
          <h2 className="text-lg font-semibold ml-4 mt-4">Chats</h2>
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
          <TableBody items={chatss}>
            {(item: any) => (
              <TableRow key={item.id ? item.id : Math.random()}>
                {(columnKey) => <TableCell className="text-center">{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ListChats;
