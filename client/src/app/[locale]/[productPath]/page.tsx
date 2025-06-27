"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { TiArrowForward } from "react-icons/ti";
import { FaCircleDot } from "react-icons/fa6";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { motion } from "framer-motion";
import AboutPage1 from "../../../components/AboutPage1";
import Header1 from "../../../components/Header1";
import Header from "../../../components/Header";
import ContactUs from "@/components/Contact";
import BookCard from "@/components/BookCard";
// import { env } from "@/lib/env"
import { useLocale } from 'next-intl';
import { useTranslations } from "next-intl";
import NotificationButton from "@/components/NotificationButton";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

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

interface Benefit {
  title: LocalizedString;
  description: LocalizedString;
}


interface Plan {
  name: LocalizedString;
  price: string | string[];
  features: LocalizedString;
  pricedescription: LocalizedString;
}

interface Testimonial {
  description: LocalizedString;
  clientName: LocalizedString;
  companyName: string;
}

interface Product {
  id?: string;
  productPath?: string;
  imageUrl?: string | string[];
  gallery?: string | string[];
  productName?: string;
  who_need_des?: LocalizedString;
  description?: LocalizedString;
  productLink?: string;
  why_choose_des?: LocalizedString;
  benefits?: Benefit[];
  customerTestimonials?: Testimonial[];
  plans?: Plan[];
}


const ProductDetails: React.FC = () => {
  const locale = useLocale();
  const translate = (text?: LocalizedString) => text?.[locale] ?? text?.en ?? "";
  const t = useTranslations('products')
  const router = useRouter();
  const searchParams = useSearchParams();
  const { productPath } = useParams() as { productPath: string };

  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [hoveredBenefitIndex, setHoveredBenefitIndex] = useState<number | null>(null);
  const [showNavbar, setShowNavbar] = useState<boolean>(true);
  const [showNavbar1, setShowNavbar1] = useState<boolean>(true);
  const [showAbout, setShowAbout] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchProduct();
    const fromProductsPage = searchParams?.get("url") === "true";

    if (!fromProductsPage) {
      setShowNavbar(true);
      setShowNavbar1(false);
      setShowAbout(false);
    } else {
      setShowNavbar(false);
      setShowNavbar1(true);
      setShowAbout(true);
    }
  }, [productPath, searchParams]);

  useEffect(() => {
    if (!product) return;

    const images = getProductImages();
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [product]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Product>(`${apiUrl}/api/product/v1/${productPath}`);
      if (response.data) {
        setProduct(response.data);
      } else {
        setError("Product not found.");
      }
    } catch (error) {
      setError("Failed to load product. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (): string[] => {
    if (!product) return [];

    if (product.imageUrl && Array.isArray(product.imageUrl)) {
      return product.imageUrl.map((img) => `${apiUrl}/${img}`);
    } else if (product.imageUrl && typeof product.imageUrl === "string") {
      return [`${apiUrl}/${product.imageUrl}`];
    }
    return [];
  };

  const getProductImages = (): string[] => {
    if (!product) return [];

    if (product.gallery && Array.isArray(product.gallery)) {
      return product.gallery.map((img) => `${apiUrl}/${img}`);
    } else if (product.gallery && typeof product.gallery === "string") {
      return [`${apiUrl}/${product.gallery}`];
    }
    return [];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-500 my-10 p-6"
      >
        {error}
      </motion.div>
    );
  }

  const productImage = getProductImage();
  const productImages = getProductImages();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div>
      {showNavbar1 && (
        <div>
          <Header1 />
        </div>
      )}

      {showNavbar && (
        <div>
          <Header />
        </div>
      )}


      <div className="container mx-auto  p-2 sm:p-6 overflow-hidden">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-center justify-evenly bg-gradient-to-br from-[#f0f2fa] to-[#e5e8f4] p-6 rounded-lg shadow-lg"
        >
          <motion.div
            className="md:w-1/2 text-left order-2 md:order-1 w-full overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="lg:text-xl xl:text-2xl font-bold mb-4 relative inline-block">
              {product?.productName || "Unnamed Product"}
              <motion.span
                className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </h2>
            <motion.div
              className="text-[12px] lg:text-base space-y-2 overflow-hidden overflow-y-hidden"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
             {product?.description && typeof product.description === "object"
                ? translate(product.description as LocalizedString)
                .split(".")
                  .filter((des: string) => des.trim())
                  .map((des: string, index: number) => (
                    <motion.p
                      key={index}
                      className="flex items-start"
                      variants={fadeIn}
                    >
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <TiArrowForward className="mt-1 md:mt-0.5 lg:mt-1 w-10 text-blue-500" />
                      </motion.span>
                      <span className="text-gray-700 w-full">
                        {des.trim()}.
                      </span>
                    </motion.p>
                  ))
                : "No description available."}
            </motion.div>

            <div className="flex gap-5 md:mt-10 py-5 ">

              {product?.productLink ? (
                <button
                  className="bg-black text-[13px] md:ml-1 px-2 md:px-4 md:py-2 md:text-sm rounded-lg mt-5 text-white hover:bg-cyan-500 transition duration-300 hover:scale-105"
                  onClick={() => window.open(product?.productLink, "_blank")}
                >
                  {t('TryButton')}
                </button>
              ) : null}


              {showNavbar1 && (
                <button
                  className="bg-blue-500 text-[13px] md:text-sm md:ml-1 px-4 py-2 rounded-lg mt-5 text-white hover:bg-blue-700 transition hover:scale-105"
                  onClick={() => router.push("/demo")}
                >
                  {t('Demobutton')}
                </button>

              )}
              {showNavbar && (

                <button
                  className="bg-blue-500 text-[13px] md:text-sm md:ml-1 px-4 py-2 rounded-lg mt-5 text-white hover:bg-blue-700 transition hover:scale-105"
                  onClick={() => router.push("#contact")}
                >
                  {t('Demobutton')}
                </button>
              )}

            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="w-full h-60 mb-10 md:h-auto md:w-96 md:ml-5 md:-mt-10 lg:-mt-0 flex justify-center order-1 md:order-2 shadow-lg rounded-lg overflow-hidden shadow-blue-400"
            initial={{ opacity: 0, x: 50, rotate: -3 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ scale: 1.03, rotate: 0 }}
          >
            <img
              src={productImage[0] || "/placeholder.jpg"}
              className="w-full md:h-60 lg:h-96 object-cover transition-all duration-700 hover:scale-110"
              aria-label="Product Image"
            />
          </motion.div>
        </motion.div>

        {/* Why Choose Section */}
        <motion.div
          className="mt-16 w-full mx-auto text-center overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <motion.h1
            className="md:text-xl lg:text-2xl font-semibold relative inline-block pt-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {t('WhyChoose')} {" "}
            <span className="text-blue-600">
              {product?.productName || "This Product"}
            </span>
           {" "} ?
            <motion.div
              className="h-1 w-24 bg-blue-500 mx-auto mt-2 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "100px" }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
          </motion.h1>
          <motion.p
            className="mt-5 text-gray-700 max-w-4xl mx-auto text-[12px] sm:text-sm lg:text-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
              {product?.why_choose_des ? translate(product.why_choose_des as LocalizedString) : "No information available."}
          </motion.p>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-col-3 max-w-7xl mx-auto xl:py-5 pb-5"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {product?.benefits && product?.benefits.length > 0 ? (
            product.benefits.map((benefit: Benefit, index: number) => (
              <motion.div
                key={index}
                className="shadow-lg p-6 text-center bg-white rounded-lg border border-gray-100 hover:shadow-xl transition overflow-hidden relative"
                variants={fadeIn}
                whileHover={{
                  y: -5,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.3 },
                }}
                onMouseEnter={() => setHoveredBenefitIndex(index)}
                onMouseLeave={() => setHoveredBenefitIndex(null)}
              >
                <motion.div
                  className="absolute inset-0  rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredBenefitIndex === index ? 0.4 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                <motion.div
                  className="absolute top-0 left-0 w-2 h-full bg-blue-500"
                  initial={{ height: 0 }}
                  animate={{
                    height: hoveredBenefitIndex === index ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.3 }}
                />

                <h3 className="mt-4 text-[14px] md:text-[16px] lg:text-lg font-semibold text-gray-800">
                   {benefit?.title ? translate(benefit.title as LocalizedString) : "Untitled Benefit"}
                </h3>
                <p className="mt-2 text-gray-600 text-[12px] md:text-sm relative z-10">
                   {benefit?.description ? translate(benefit.description as LocalizedString) : "Untitled Benefit"}
                </p>
              </motion.div>
            ))
          ) : (
            <motion.div className="col-span-3 text-center text-gray-500">
              No benefits available for this product.
            </motion.div>
          )}
        </motion.div>

        {/* Who Needs Section */}
        <motion.div
          className="mt-16 w-full mx-auto text-center flex flex-col overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <motion.h1
            className="md:text-xl lg:text-2xl font-semibold relative inline-block mx-auto pt-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {t('WhoNeed')}{" "}
            <span className="text-blue-600 mr-1">
              {product?.productName || "This Product"}

            </span>
            ?
            <motion.div
              className="h-1 w-24 bg-blue-500 mx-auto mt-2 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "100px" }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
          </motion.h1>
          <motion.div
            className="mt-8 text-gray-800 max-w-3xl mx-auto flex flex-col text-xl overflow-hidden"
            variants={stagger}
          >
           
                {product?.who_need_des && typeof product.who_need_des === "object"
                ? translate(product.who_need_des as LocalizedString)
                .split(".")
                .filter((sentence: string) => sentence.trim())
                .map((sentence: string, index: number) => (
                  <motion.div
                    key={index}
                    className="flex gap-3 w-full text-left py-2 text-[14px] md:text-[16px]"
                    variants={fadeIn}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="text-blue-500"
                    >
                      <MdOutlineSubdirectoryArrowRight />
                    </motion.span>
                    <span className="text-[13px] md:text-[16px] lg:text-lg">
                      {sentence.trim()}
                    </span>
                  </motion.div>
                ))
              : "No information available."}
          </motion.div>
        </motion.div>

        {/* Product Images */}
        <motion.div
          className="mt-16 w-full mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          {productImages.length > 0 ? (
            <>
              <motion.h1
                className="text-lg lg:text-2xl font-semibold md:mb-6 relative inline-block"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {t('ProductImages')}
                <motion.div
                  className="h-1 w-24 bg-blue-500 mx-auto mt-2 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "80px" }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                />
              </motion.h1>
              <motion.div
                className="flex flex-wrap gap-4 justify-center py-10 px-3"
                variants={stagger}
              >
                {productImages.map((img, index) => (
                  <motion.div
                    key={index}
                    className="w-full h-52 md:w-80 md:h-56 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-transform duration-300 ease-in-out transform hover:scale-105 relative group z-20"
                    variants={fadeIn}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product?.productName || "Product"} - Image ${index + 1
                        }`}
                      className="w-full h-full border border-gray-100 object-center transition-all transform hover:scale-150"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : null}
        </motion.div>

        {/* Testimonials Section */}
        {product?.customerTestimonials && product.customerTestimonials.length > 0 ? (

          <motion.div
            className="mt-16 w-full mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <motion.h1
              className="text-lg md:text-lg lg:text-2xl font-semibold relative inline-block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
             {t('Customers')}
              <motion.div
                className="h-1 w-24 bg-blue-500 mx-auto mt-2 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100px" }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
            </motion.h1>
            <motion.div
              className="md:mt-8 flex flex-wrap gap-8 justify-center max-w-7xl mx-auto py-5"
              variants={stagger}
            >
              {product?.customerTestimonials &&
                product.customerTestimonials.length > 0 ? (
                product.customerTestimonials.map((testimonial: Testimonial, index: number) => (
                  <motion.div
                    key={index}
                    className="shadow-lg p-6 text-center bg-white rounded-lg border border-gray-100 hover:shadow-xl transition overflow-hidden flex-grow flex-shrink-0 basis-80"
                    variants={fadeIn}
                    whileHover={{
                      y: -5,
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      transition: { duration: 0.3 },
                    }}
                  >
                    <p className="text-gray-700 italic">
  "{testimonial?.description ? translate(testimonial.description as LocalizedString) : 'No description'}"
</p>

                    <h3 className="mt-4 md:text-lg font-semibold text-gray-800">
                     
            { testimonial?.clientName ? translate(testimonial.clientName as LocalizedString) : "" }
            

                    </h3>
                    <p className="text-sm text-gray-500">
                      {testimonial.companyName}
                    </p>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="w-full text-center text-gray-500"
                  variants={fadeIn}
                >
                  No testimonials available for this product.
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ) : null}

        {/* Product Plans Section */}
        {product?.plans && product?.plans.length > 0 ? (
          <motion.div
            className="mt-16 w-full mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <motion.h1
              className="text-lg lg:text-2xl font-semibold relative inline-block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}  >
             {t('plans')}
              <motion.div
                className="h-1 w-24 bg-blue-500 mx-auto mt-2 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                transition={{ delay: 0.3, duration: 0.6 }} />
            </motion.h1>
          
            <motion.div
  className="w-full mx-auto mt-12 flex flex-wrap justify-center gap-8 py-5"
  variants={stagger}
>
  {product?.plans && product.plans.length > 0 ? (
    product.plans.map((plan, index) => (
      <motion.div
        key={index}
        className="max-w-sm bg-white border border-gray-200 rounded-2xl shadow-lg p-6 w-70 hover:shadow-xl transition relative overflow-hidden flex-grow flex-shrink-0 basis-64"
        variants={fadeIn}
        whileHover={{
          y: -8,
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          transition: { duration: 0.3 },
        }}
      >
 
        <motion.div
          className="absolute top-0 right-0 w-20 h-20 bg-blue-500 rounded-bl-full -translate-y-10 translate-x-10"
          initial={{ y: -50, x: 50 }}
          whileInView={{ y: -30, x: 30 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        />

        {/* Plan Name */}
        <div className="flex justify-between">
          <h2 className="text-xl font-bold text-blue-600">
            {translate(plan.name)}
          </h2>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-5">
         <span className="">{translate(plan.pricedescription)}</span>
        </p>

        {/* Price */}
        <motion.p
          className="text-2xl font-bold text-gray-800 mt-4"
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          ₹{String(plan.price).split("/")[0]}
          {String(plan.price).includes("/") && (
            <span className="text-sm font-normal text-gray-500">
              /{String(plan.price).split("/")[1]}
            </span>
          )}
        </motion.p>

        {/* Features */}
        <motion.div
          className="mt-5 text-gray-700 max-w-3xl mx-auto"
          variants={stagger}
        >
          {plan.features ? (
            <div className="flex flex-col gap-2">
              {translate(plan.features)
                .split(".")
                .filter((sentence) => sentence.trim())
                .map((sentence, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-3 items-start w-full"
                    variants={fadeIn}
                    initial={{ x: -10, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <motion.span
                      className="mt-0.5 text-blue-600 text-[12px]"
                      whileHover={{ scale: 1.2 }}
                    >
                      <FaCircleDot />
                    </motion.span>
                    <span className="text-[12px]">
                      {sentence.trim()}
                    </span>
                  </motion.div>
                ))}
            </div>
          ) : (
            "No information available."
          )}
        </motion.div>
      </motion.div>
    ))
  ) : (
    <motion.div
      className="w-full text-center text-gray-500"
      variants={fadeIn}
    >
      No plans available for this product.
    </motion.div>
  )}
</motion.div>

          </motion.div>

        ) : null}

        <BookCard />

        {showAbout && (
          <div className=" mt-14 md:mt-28 ">
            <AboutPage1 />
          </div>
        )}


        {showAbout && (
          <div className="mt-24">
            <ContactUs />
          </div>
        )}
        <NotificationButton/>
      </div>
    </div>
  );
};

export default ProductDetails;
