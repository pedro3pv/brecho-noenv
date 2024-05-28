import React, { useEffect } from 'react';
import { LuChevronLeft, LuChevronRight, LuChevronDown } from "react-icons/lu";
import 'rc-slider/assets/index.css';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

const ProductListTest = (products: any) => {
  const router = useRouter();
  const numbers = products.listnumbers
  const { t } = useTranslation('common');
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["Filtro"]));
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedValue == t('defaultOrdering')) {
      url.searchParams.set('filter', 'defaultOrdering');
      window.location.href = url.toString();
    } else if (selectedValue == t('mostExpensive')) {
      url.searchParams.set('filter', 'mostExpensive');
      window.location.href = url.toString();
    } else if (selectedValue == t('cheaPest')) {
      url.searchParams.set('filter', 'cheaPest');
      window.location.href = url.toString();
    }
    window.history.pushState({}, '', url.toString());
  }, [selectedKeys]);

  const onClick = (number: Number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', number.toString());
    window.location.href = url.toString();
  }

  const numberr = products.numberr - 1

  const buttons = numbers.map((number: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | Iterable<React.ReactNode> | null | undefined, index: React.Key | undefined) => (
    <button
      key={Number(number)}
      className={`m-1 px-3 py-1 border border-gray-300 rounded-md ${index == numberr ? 'bg-gray-200' : 'bg-white'}`}
      onClick={() => { onClick(Number(number)) }}
    >
      {number}
    </button>
  ));

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4 mr-56">
        <div className="text-gray-700 font-inter font-medium">
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="bordered"
              className="capitalize"
            >
              {selectedValue}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label=""
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={(selection) => {
              const stringSelection = new Set(Array.from(selection).map(String));
              setSelectedKeys(stringSelection);
            }}
          >
            <DropdownItem key={t('defaultOrdering')}>{t('defaultOrdering')}</DropdownItem>
            <DropdownItem key={t('mostExpensive')}>{t('mostExpensive')}</DropdownItem>
            <DropdownItem key={t('cheaPest')}>{t('cheaPest')}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className="flex-grow">
        <div className="container mx-auto">
          <div className="mr-52 grid gap-y-4 gap-x-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
            {products.products.map((product: {
              _id: string; imageUrl: string | undefined; title: {} | null | undefined; status: any; price: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | Iterable<React.ReactNode> | null | undefined;
            }, index: React.Key | undefined) => (
              <div key={index} className="col-span-1">
                <button className="w-64 h-auto bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition duration-300" onClick={() => router.push('/product/' + product._id)}>
                  <div className="p-2 justify-center items-center">
                    <img src={product.imageUrl} className="w-full h-auto object-cover" style={{ aspectRatio: '4/5' }} />
                    <p className="text-lg font-semibold text-gray-800">{product.title}</p>
                    <div className="flex flex-row ml-4 justify-center items-center">
                      <p className="text-gray-600 text-md mt-2">{product.price}</p>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center mr-56">
        <div className="border border-gray-300 rounded-md flex p-2">
          <button className="m-1 px-3 py-1 border border-gray-300 rounded-md bg-white opacity-50 cursor-not-allowed">
            <LuChevronLeft />
          </button>
          <div className="flex items-center">
            {buttons}
          </div>
          <button className="m-1 px-3 py-1 border border-gray-300 rounded-md bg-white opacity-50 cursor-not-allowed">
            <LuChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductListTest;
