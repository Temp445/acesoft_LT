'use client';

import React, { useEffect, useState } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/Header";
// import { env } from "@/lib/env"
import { useLocale } from 'next-intl';
import { useTranslations } from "next-intl";
import NotificationButton from "@/components/NotificationButton";
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

interface LocalizedString {
  en: string;
  be?: string;
  br?: string;
  de?: string;
  es?: string;
  hi?: string;
  fr?: string;
  it?: string;
  ja?: string;
  kr?: string;
  ru?: string;
  zh?: string;
  [key: string]: string | undefined; 
}

interface Product {
  _id: string;
  productName: string;
   description?: LocalizedString;
  category: LocalizedString;
  imageUrl?: string | string[];
  productPath: string;
}

const customOrder = [
  'Sales',
  'Engineering',
  'Finance',
  'Human Resource',
  'Project Management',
  'Enterprise (ERP Solutions)'
];


const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const locale = useLocale();
  const translate = (text?: LocalizedString) => text?.[locale] ?? text?.en ?? "";
  const t = useTranslations('products')
  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, []);


  // trackConversion({
  //   event: 'productpage_view',
  //   form_id: 'n/a',
  //   form_name: 'Productpage Visit'
  // });

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>(`${apiUrl}/api/product`);
      setProducts(response.data);
      setFilteredProducts(response.data);
      extractCategories(response.data);
      setLoading(false);
    } catch (error) {
      setError("Please try again later.");
      setLoading(false);
    }
  };

  const extractCategories = (products: Product[]) => {
    const allCategories =  products.map(product => translate(product.category));
    const uniqueCategories = [t('all'), ...Array.from(new Set(allCategories))];
    setCategories(uniqueCategories);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === t('all')) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
         product => translate(product.category) === category
      );
      setFilteredProducts(filtered);
    }
  };

  const getImageUrl = (product: Product): string | undefined => {
    if (
      product.imageUrl &&
      Array.isArray(product.imageUrl) &&
      product.imageUrl.length > 0
    ) {
      return `${apiUrl}/${product.imageUrl[0]}`;
    } else if (product.imageUrl && typeof product.imageUrl === "string") {
      return `${apiUrl}/${product.imageUrl}`;
    }
    return undefined;
  };

  const goToProduct = (product: Product) => {
    router.push(`/${product.productPath}`);
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen h-full 2xl:container w-full mx-auto">
        <div className="w-full h-50 bg-[#FFF5F5] flex flex-col items-center justify-center text-center p-6 mb-3 2xl:rounded-5">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{t('Title')}</h1>
          <p className="text-sm mt-2 text-gray-700">
            {t('Subtitle')}
          </p>
        </div>

        <div className="container mx-auto flex flex-col md:flex-row mb-20 sm:ml-2">
          <div className="hidden md:block lg:w-1/4 xl:w-1/5 border border-gray-200 p-4 rounded-lg backdrop-blur-lg shadow-lg">
            <h2 className="text-lg font-bold mb-3">{t('Categories')}</h2>
            <ul>
              {[...categories]
                .sort((a, b) => customOrder.indexOf(a) - customOrder.indexOf(b))
                .map((category, index) => (
                  <li
                    key={index}
                    onClick={() => handleCategoryChange(category)}
                    className={`cursor-pointer py-2 px-3 rounded-lg mb-2 ${selectedCategory === category
                      ? "bg-[#becdd750] border border-gray-100"
                      : "hover:bg-[#e8ebed50]"
                      }`}
                  >
                    {category}
                  </li>
                ))}
            </ul>
          </div>

          {/* Category for Mobile */}
          <div className="block md:hidden w-full mb-2 px-4 h-auto">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg"
              aria-label="Category"
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Product Listing */}
          <div className="w-full md:w-3/4 p-4 sm:ml-10">
            {error && <div className="text-red-500 text-center my-6">{error}</div>}

            {loading ? (
              <p className="text-center text-gray-500 my-6">{t('Loading')}...</p>
            ) : filteredProducts.length === 0 ? (
              <p className="text-center text-gray-500 my-6">{t('Nofound')}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-2 lg:gap-6 px-1 py-3 xl:px-5">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="border border-gray-200 rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-lg w-full max-w-sm mx-auto"
                  >
                    <div onClick={() => goToProduct(product)}>
                      <img
                        src={getImageUrl(product)}
                        className="w-full h-60 object-cover p-2 rounded-xl border-b border-gray-200 cursor-pointer"
                        alt={product.productName}
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="underline underline-offset-2 text-sm font-semibold">
                        {product.productName}
                      </h2>
                      <p className="text-xs mt-2">
                        {product.description && translate(product.description as LocalizedString).split(".")[0]}
                      </p>
                      <div onClick={() => goToProduct(product)}>
                        <div className="flex justify-between mt-4">
                          <Link href={`/${product.productPath}`} className="text-sm hover:underline flex">
                            {t('LearnMore')}
                            <span className="mt-1 ml-1">
                              <FaArrowAltCircleRight />
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
              <NotificationButton/>
    </div>
  );
};

export default ProductsPage;
