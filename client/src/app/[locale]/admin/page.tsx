'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoAddCircle } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaRegEdit, FaUsersCog } from 'react-icons/fa';
import axios from 'axios';
// import { env } from "@/lib/env"
import AdminProtectedRoute from '@/components/ProtectedRoute';
import { useLocale } from 'next-intl';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
  productPath: string;
  productName: string;
  description?: LocalizedString;
  category?: LocalizedString;
  imageUrl?: string[];
}

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<LocalizedString[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const locale = useLocale();
  const t = (text?: LocalizedString) => text?.[locale] ?? text?.en ?? "";
  // Fetch product data
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Product[]>(`${apiUrl}/api/product`);
      setProducts(res.data);

      const categorySet = new Set<string>();
      res.data.forEach((product) => {
        const category = t(product.category);
        if (category) categorySet.add(category);
      });

         setCategories(Array.from(categorySet).map((name) => ({ [locale]: name, en: name })));
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const deleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      await axios.delete(`${apiUrl}/api/product/${id}`);
      alert("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const getImageUrl = (product: Product): string | undefined => {
    if (product.imageUrl && Array.isArray(product.imageUrl) && product.imageUrl.length > 0) {
      return `${apiUrl}/${product.imageUrl[0]}`;
    }
  };

  // Filtered products by category
  const filteredProducts = selectedCategory
    ? products.filter(product => t(product.category) === selectedCategory)
    : products;

  return (
    <AdminProtectedRoute>
      <div>
        <div className="max-w-6xl mx-auto my-12 p-6 border-0 bg-white lg:border lg:border-gray-300 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Product List</h2>
            <div className="flex gap-5">
              <Link
                href="/user"
                className="flex text-[12px] lg:text-[14px] items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
              >
                <div className="text-[14px] lg:text-xl mb-1" > <FaUsersCog /> </div>
                User List
              </Link>
              <Link
                href="/admin/upload"
                className="flex text-[12px] lg:text-[14px] items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
              >
                <div className="text-[14px] lg:text-xl mb-0.5"> <IoAddCircle /> </div>
                Add New Product
              </Link>
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-3 py-1 rounded-full text-sm ${selectedCategory === ''
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                >
                  All
                </button>
                {categories.sort((a, b) => t(a).localeCompare(t(b))).map((category, index) => {
                const name = t(category);
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(name)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === name
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div>Loading ...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">
                {selectedCategory
                  ? `No products found in ${selectedCategory} category.`
                  : "No products uploaded yet."}
              </p>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory("")}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Show all products
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-5">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Link href={`/${product.productPath}/?url=true`}>
                      <img
                        src={getImageUrl(product)}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {product.productName}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 h-10">
                    {product.description && t(product.description as LocalizedString).split(".")[0]}

                    </p>

                    <div className="flex justify-between items-center pt-3 border-t">
                      <Link
                        href={`/${product.productPath}/?url=true`}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/edit/${product._id}`}
                          className="bg-gray-100 text-gray-700 p-2 rounded-full hover:bg-gray-200 transition"
                          title="Edit Product"
                        >
                          <FaRegEdit />
                        </Link>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="bg-gray-100 text-red-500 p-2 rounded-full hover:bg-gray-200 transition"
                          title="Delete Product"
                        >
                          <RiDeleteBin6Line />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default Dashboard;
