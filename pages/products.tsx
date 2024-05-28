import React, { useEffect, useState } from 'react';
import Footer from '../lib/components/Footer';
import Header from '../lib/components/Header';
import { useTranslation } from 'next-i18next';
import 'rc-slider/assets/index.css';
import ProductListTest from '../lib/components/productListTest';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getAllProductCategoriesApproved, getAllProductsApproved } from '../lib/models/Product';
import dynamic from 'next/dynamic';
import { Button } from '@nextui-org/react';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const categorys = await getAllProductCategoriesApproved();
    const parsedUrlQuery: ParsedUrlQuery = context.query;
    let products = null;
    const page = parsedUrlQuery.page as string;
    const filter = parsedUrlQuery.filter as string;
    const category = parsedUrlQuery.categories as string;
    const minValue = parsedUrlQuery.min as string;
    const maxValue = parsedUrlQuery.max as string;
    const text = decodeURIComponent(parsedUrlQuery.text as string || '');
    const numbers = [(Number(page)) - 1, Number(page), (Number(page) + 1)];

    async function checkNumbers(numbers: number[]) {
        const numbersWithValues: any[] = [];
        for (let i = 0; i < numbers.length; i++) {
            if (numbers[i] > 0) {
                if ((await getAllProductsApproved(numbers[i] - 1)).length > 0) {
                    numbersWithValues.push(numbers[i])
                }
            }
        }
        return numbersWithValues;
    }

    const numberss = await checkNumbers(numbers)

    if (page) {
        const priceRange = {
            min: Number(minValue),
            max: Number(maxValue)
        }
        products = await getAllProductsApproved(Number(page) - 1, category, filter, priceRange, text)
        products = products.map(product => ({ ...product, _id: product._id.toString() }));
    } else {
        return { notFound: true }
    }
    if (products) {
        return {
            props: {
                ...(await serverSideTranslations(context.locale!, ['common'])),
                products: products,
                categorys: categorys,
                numbers: numberss,
                numberr: page,
                categoryy: category || "",
                min: minValue || null,
                max: maxValue || null
            }
        }
    }
};

const RangeSlider: React.FC<{
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
}> = ({ min, max, value, onChange }) => {
    return (
        <Slider
            min={min}
            max={max}
            value={value}
            onChange={onChange as (value: number | number[]) => void}
            range
            allowCross={false}
            handleStyle={[{ backgroundColor: 'black', borderColor: 'black', opacity: 1 }, { backgroundColor: 'black', borderColor: 'black', opacity: 1 }]}
            trackStyle={[{ backgroundColor: 'black' }]}
        />
    );
};

const Slider = dynamic(() => import('rc-slider'), { ssr: false });


const ProductListing = (products: any) => {
    const [isClient, setIsClient] = useState(false);
    const categorys = products.categorys;

    useEffect(() => {
        setIsClient(true);
    }, []);
    const { t } = useTranslation('common');
    const [selectedCategories, setSelectedCategories] = useState<string>();
    const [priceRange, setPriceRange] = useState<[number, number]>([products.min || 1, products.max || 10000]);
    const [appliedFilters, setAppliedFilters] = useState<string>();

    const handleCategorySelection = (category: string) => {
        if (selectedCategories === category) {
            setSelectedCategories(undefined);
            removeFilter("");
        } else {
            setSelectedCategories(category);
            updateAppliedFilters(`Categoria: ${category}`);
        }
    };

    const handlePriceChange = (value: number | number[]) => {
        const rangeValue: [number, number] = Array.isArray(value) ? [value[0], value[value.length - 1]] : [value, value];
        setPriceRange(rangeValue);
    };

    const removeFilter = (category: string) => {
        setAppliedFilters(category);
    };

    const updateAppliedFilters = (category: string) => {
        setAppliedFilters(category);
    };

    function applyFilter() {
        const url = new URL(window.location.href);
        if (selectedCategories && selectedCategories != undefined) {
            url.searchParams.set('categories', selectedCategories);
            url.searchParams.set('min', priceRange[0].toString());
            url.searchParams.set('max', priceRange[1].toString());
        } else {
            url.searchParams.set('categories', "");
            url.searchParams.set('min', priceRange[0].toString());
            url.searchParams.set('max', priceRange[1].toString());
        }
        window.location.href = url.toString();
    }

    function convertProducts(prods: any[]): any[] {
        const test = prods.map((product: {
            _id: any; name: any; price: number; quantity: number; photo: any;
        }) => {
            if (!product.name || !product.price || !product.photo) {
                console.error('Produto incompleto:', product);
                return null;
            }

            return {
                _id: product._id,
                title: product.name,
                price: `R$${product.price.toFixed(2)}`,
                status: product.quantity > 0,
                imageUrl: product.photo[0],
                createdAt: "",
            };
        }).filter(Boolean);

        return test
    }

    useEffect(() => {
        if (products.categoryy) {
            handleCategorySelection(products.categoryy);
        }
    }, [products.categoryy]);

    return (
        <main className="h-screen w-screen flex flex-col">
            <Header />
            <div className="flex w-full flex-1 justify-center items-start">
                <div className="flex flex-col w-64 h-auto mt-20 ml-10 rounded-md border-2 border-gray-300 p-4 md:p-8">
                    <div className="mb-8">
                        <h2 className="text-lg font-medium font-inter mb-2">{t('categories')}</h2>
                        <div className="flex flex-col mb-2">
                            {categorys.map((category: string | null | undefined) => (
                                <button
                                    key={category!}
                                    className={`w-full h-12 border border-gray-300 rounded-md mb-2 focus:outline-none text-center ${selectedCategories?.includes(category!) ? 'bg-white text-black' : 'bg-white text-black'
                                        }`}
                                    onClick={() => {
                                        handleCategorySelection(category!)
                                    }}
                                    style={{ borderColor: selectedCategories?.includes(category!) ? 'black' : 'gray', borderWidth: '2px' }}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-medium font-inter mb-2">{t('price')}</h2>
                        <div className="mb-2">
                            {isClient && <RangeSlider min={1} max={10000} value={priceRange} onChange={handlePriceChange} />}
                            <div className="flex justify-between mt-4">
                                <span>R$ {priceRange[0]}</span>
                                <span>R$ {priceRange[1]}</span>
                            </div>
                        </div>
                    </div>
                    <Button color="default" onClick={applyFilter}>
                        {t("applyFilter")}
                    </Button>
                </div>

                <div className="flex-1 ml-4 mt-20">
                    <h2 className="text-lg font-medium font-inter mb-2">{t("appliedFilters")}</h2>
                    <div className="flex flex-wrap">
                        <div className={appliedFilters ? "font-medium text-black border border-gray-300 rounded-full px-2 py-1 mr-2 mb-2 flex items-center" : ""}>
                            <span>{appliedFilters}</span>
                        </div>
                    </div>
                    <ProductListTest products={convertProducts(products.products)} listnumbers={products.numbers} numberr={products.numberr} />
                </div>
            </div>
            <Footer />
        </main>
    );
};

export default ProductListing;
