'use client';

import React, { useEffect, useState } from "react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import CMS from "@/assets/Images/CMS1.png";
import PMS from "@/assets/Images/PMS.png";
import ClientCarousel from "../../components/Clients";
import { BiSolidRightArrowSquare } from "react-icons/bi";
import Count from "../../components/Count";
import Link from 'next/link';
import { motion, useAnimation, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Header from "@/components/Header";
import { SlCalender } from "react-icons/sl";
import { useTranslations } from "next-intl";
import { useLocale } from 'next-intl';
// import { env } from "@/lib/env"
import NotificationButton from "@/components/NotificationButton";
const apiUrl =process.env.NEXT_PUBLIC_API_URL ?? "";


interface Product {
  _id: string;
  productPath: string;
  name: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: custom * 0.1 || 0,
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

const slideIn = (direction: "left" | "right" | "up" | "down" = "left"): Variants => ({
  hidden: {
    x: direction === "left" ? -60 : direction === "right" ? 60 : 0,
    y: direction === "up" ? 60 : direction === "down" ? -60 : 0,
    opacity: 0,
  },
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut" as const, // ✅ cast to satisfy TS
    },
  },
});

const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

function useAnimationOnScroll(): [React.RefCallback<HTMLDivElement>, ReturnType<typeof useAnimation>] {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return [ref, controls];
}

const HomePage: React.FC = () => {
  const t = useTranslations('Hero');
  const locale = useLocale();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [heroRef, heroControls] = useAnimationOnScroll();
  const [aboutRef, aboutControls] = useAnimationOnScroll();
  const [featuresRef, featuresControls] = useAnimationOnScroll();
  const [pmsRef, pmsControls] = useAnimationOnScroll();


  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${apiUrl}/api/product`);
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);


  // useEffect(() => {
  //   trackConversion({
  //     event: 'homepage_view',
  //     form_id: 'n/a',
  //     form_name: 'Homepage Visit'
  //   });
  // }, []);
 const width = {
    en: 'text-3xl sm:text-2xl md:text-5xl lg:text-4xl xl:text-5xl pb-2',
    zh: 'text-2xl sm:text-2xl md:text-5xl lg:text-4xl xl:text-5xl pb-2',
    ru: 'text-xl sm:text-2xl md:text-5xl lg:text-3xl xl:text-5xl pb-2',
    de: 'text-2xl sm:text-2xl md:text-5xl lg:text-4xl xl:text-4xl pb-2',
    fr: 'text-xl sm:text-2xl md:text-5xl lg:text-4xl xl:text-4xl pb-2',
    es: 'text-2xl sm:text-2xl md:text-5xl lg:text-3xl xl:text-4xl pb-2',
    it: 'text-2xl sm:text-2xl md:text-5xl lg:text-4xl xl:text-3xl 2xl:text-5xl pb-2',
    br: 'text-xl sm:text-2xl md:text-5xl lg:text-4xl  2xl:text-5xl pb-2',
    ja: 'text-xl sm:text-2xl md:text-5xl lg:text-3xl  2xl:text-4xl pb-2',
    kr: 'text-xl sm:text-2xl md:text-5xl lg:text-3xl  2xl:text-5xl pb-2',
    hi: 'text-2xl sm:text-2xl md:text-5xl lg:text-4xl xl:text-5xl  leading-normal',
    be: 'text-2xl sm:text-2xl md:text-5xl lg:text-4xl xl:text-5xl  leading-normal',

  }[locale] || 'text-3xl sm:text-2xl md:text-5xl lg:text-4xl xl:text-5xl';

  return (
    <div className="w-full mx-auto justify-center items-center xxl:container">
      <Header />
      {/* Hero Section */}
      <div className="bg-[#FFF5F5]">
        <motion.section
          ref={heroRef}
          initial="hidden"
          animate={heroControls}
          className="flex flex-col-reverse lg:flex-row items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 py-0 sm:py-5 container mx-auto"
        >
          <div className="w-full lg:w-1/2 xl:px-6">
            <motion.div variants={staggerContainer} className="flex flex-col lg:items-start">
              <motion.h1
                variants={fadeIn}
                custom={0}
                className={`${width} font-bold text-[#F7666F] text-left  mb-4 sm:mb-6  overflow-hidden  `}>
                {t('Title')} <br className="block" />
                <span className="text-[#403D3D]">{t('highlight')}</span>
              </motion.h1>

              <motion.video
                variants={scaleUp}
                className="h-auto justify-center mx-auto w-4/5 sm:w-7/12 my-4 lg:hidden"
                preload="auto"
                poster="/videos/Landing.png"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/videos/LandingVideo.webm" type="video/webm" />
              </motion.video>

              <motion.p
                variants={fadeIn}
                custom={1}
                className="font-normal w-full text-justify lg:text-left text-xs sm:text-sm md:text-base lg:text-base xl:text-lg text-gray-700 xl:text-gray-600 my-4 sm:my-6"
              >
                  {t('Description')}
              </motion.p>

              <motion.div
                variants={fadeIn}
                custom={2}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="self-start"
              >
                <Link
                  href="/contact"
                  className="flex items-start mt-1 mb-2 sm:mt-4 lg:mt-6 xl:mt-8  py-2 gap-2 text-lg md:text-lg md:text-bold lg:font-extrabold xl:text-2xl text-[#F7666F] font-bold transition-all"
                >
                  {t('button.Contact')}{" "}
                  <BiSolidRightArrowSquare className="mt-1 text-lg md:text-xl lg:text-2xl" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            variants={slideIn("right")}
            initial="hidden"
            animate={heroControls}
            className="w-full lg:w-1/2 flex justify-center items-center mb-6 lg:mb-0"
          >
            <video
              className="hidden lg:block w-4/5 md:w-full lg:w-11/12 xl:w-10/12 h-auto"
              preload="auto"
              poster="/videos/Landing.png"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/videos/LandingVideo.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </motion.section>
      </div>

      {/* About Section */}
      <motion.div
        ref={aboutRef}
        initial="hidden"
        animate={aboutControls}
        className="bg-white px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12"
      >
        <div className="grid md:grid-cols-2 items-center container gap-6 md:gap-8 lg:gap-10">
          <motion.video
            variants={slideIn("left")}
            className="hidden sm:block w-11/12 md:w-full xl:w-[550px] h-auto mx-auto"
            preload="auto"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/About.mp4" type="video/mp4" />
          </motion.video>

          <motion.div variants={staggerContainer}>
            <motion.h2
              variants={fadeIn}
              custom={0}
              className="text-xl md:h-12 sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-black text-center md:text-left mb-4"
            >
              {t('WhoWe.Title')}
            </motion.h2>

            <motion.video
              variants={scaleUp}
              className="w-4/5 sm:w-3/5 h-auto mx-auto my-4 sm:hidden"
              preload="auto"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/videos/About.mp4" type="video/mp4" />
            </motion.video>

            <motion.p
              variants={fadeIn}
              custom={1}
              className="w-full text-[12px] sm:text-sm md:text-base lg:text-base xl:text-lg text-justify md:text-left text-gray-700 xl:text-gray-600"
            >
              <span className="text-[#F7666F]">ACE Software Solutions Pvt. Ltd;</span>{" "}
              {t('WhoWe.Description')}
            </motion.p>

            <motion.div
              variants={fadeIn}
              custom={2}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="flex justify-start"
            >
              <Link
                href="/about"
                className="mt-4 sm:mt-6 gap-2 text-[#F7666F] font-semibold text-[12px] sm:text-sm md:text-base flex items-center"
              >
                {t('button.readmore')} <FaArrowAltCircleRight className="mt-0.5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Counter Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Count />
      </motion.div>

      {/* Features Section */}
      <motion.div
        ref={featuresRef}
        initial="hidden"
        animate={featuresControls}
        className="px-4 sm:px-6 md:px-8 lg:px-12 py-8"
      >
        <div className="container mx-auto">
          <motion.h1
            variants={fadeIn}
            className="text-center text-xl  sm:text-xl md:text-2xl lg:text-2xl font-bold mb-6 sm:mb-8 lg:mb-10"
          >
            {t('product.Title')}
          </motion.h1>

          {/* CMS Feature */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-between mb-10 sm:mb-16 lg:mb-0 xl:ml-10 border border-gray-300 rounded-sm shadow-sm md:shadow-none md:border-0">
            <motion.div variants={staggerContainer} className="w-full md:w-1/2 bg-white rounded-xl p-4 sm:p-6">
              <motion.h2
                variants={fadeIn}
                custom={0}
                className="sm:block font-bold text-base sm:text-lg lg:text-xl xl:text-2xl text-left mb-3"
              >
                ACE CMS
              </motion.h2>

              <motion.div variants={scaleUp} className="hidden w-full px-10 sm:px-0 mx-auto mb-4">
                <Image src={CMS} alt="ACE CMS Illustration" className="w-full rounded-md" />
              </motion.div>

              <motion.p
                variants={fadeIn}
                custom={1}
                className="text-[12px] sm:text-sm md:text-base xl:text-lg text-justify md:text-left text-gray-700 xl:text-gray-600"
              >
                <span className="text-[#F7666F] font-semibold">ACE Calibration Management System</span>{" "}
               {t('product.cmspara1')}
                <span className="hidden sm:block mt-2">
                  {t('product.cmspara2')}
                </span>
              </motion.p>

              <motion.div
                variants={fadeIn}
                custom={2}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="flex justify-start"
              >
                <Link
                  href={`/${products[0]?.productPath}`}
                  className="mt-4 flex items-center gap-2 text-[12px] sm:text-sm text-[#F7666F] font-semibold"
                >
                  {t('button.readmore')} <FaArrowAltCircleRight className="mt-0.5" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={slideIn("right")} className="hidden md:flex md:w-1/2 justify-center items-center">
              <Image src={CMS} alt="ACE CMS Illustration" className="w-4/5 lg:w-10/12 rounded-md" />
            </motion.div>
          </div>
        </div>

        {/* PMS Feature */}
        <motion.div
          ref={pmsRef}
          initial="hidden"
          animate={pmsControls}
          className="container mx-auto mb-6 sm:mb-0 xl:-ml-5  border border-gray-300 rounded-sm shadow-sm md:shadow-none md:border-0"
        >
          <div className="flex flex-col md:flex-row items-center bg-white rounded-xl">
            <motion.div variants={slideIn("left")} className="hidden md:flex w-full md:w-1/2 justify-center sm:p-4">
              <Image
                src={PMS}
                alt="ACE PMS Illustration"
                className="w-4/5 md:w-10/12 lg:w-[800px] xl:w-[800px] rounded-md"
              />
            </motion.div>

            <motion.div variants={staggerContainer} className="w-full md:w-1/2 p-4 sm:p-6">
              <motion.h2
                variants={fadeIn}
                custom={0}
                className="font-bold text-base sm:text-lg lg:text-xl xl:text-2xl text-left mb-3 relative flex"
              >
                ACE PMS
              </motion.h2>

              <motion.p
                variants={fadeIn}
                custom={1}
                className="text-[12px] sm:text-sm md:text-base xl:text-lg text-justify md:text-left text-gray-700 xl:text-gray-600"
              >
                <span className="text-[#F7666F] font-semibold">Ace Production Management System</span>{" "}
            {t('product.pmspara1')}{" "}
                <span className="hidden md:block mt-2">
                 {t('product.pmspara2')}
                </span>
              </motion.p>

              <motion.div
                variants={fadeIn}
                custom={2}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="flex justify-start"
              >
                <Link
                  href={`/${products[1]?.productPath}`}
                  className="mt-4 flex items-center gap-2 text-[12px] sm:text-sm text-[#F7666F] font-semibold"
                >
                   {t('button.readmore')} <FaArrowAltCircleRight className="mt-0.5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex justify-center"
        >
          <Link
            href="/products"
            className="gap-2 text-base sm:text-base underline text-[#F7666F] flex items-center font-semibold mt-0 sm:mt-0"
          >
             {t('button.Viewall')}
          </Link>
        </motion.div>
      </motion.div>

      <div className="w-full max-w-6xl lg:max-w-7xl mx-auto px-6 md:px-32 py-8 md:py-10 bg-red-50 md:rounded-xl ">
        <div className="h-[320px] md:h-96 flex flex-col items-center justify-center border bg-white border-gray-300 rounded-xl p-8 shadow-lg relative">
          <div className="w-20 h-1 rounded-2xl justify-center bg-red-400"></div>
          <h1 className="text-xl md:text-3xl font-extrabold text-center text-gray-800 mb-6 mt-8 md:mt-2 lg:mt-14 overflow-hidden">
            {t('DemoCard.Title')}
          </h1>

          <p className="text-[12px] md:text-lg text-center text-gray-600 max-w-3xl mb-10 md:mb-5 lg:mb-10 overflow-hidden">
            {t('DemoCard.para')}
          </p>

          <Link
            href="/contact"
            className="overflow-hidden inline-flex md:mt-8 gap-3 text-sm md:text-lg items-center justify-center px-6 py-3 border border-red-500 font-medium rounded-full hover:bg-red-600 hover:text-white transition-colors duration-200 shadow-lg"
          >
            <span className="mb-1">
              <SlCalender className="text-xl font-bold" />
            </span>{" "}
            {t('button.BookDemo')}
          </Link>
        </div>
      </div>
        <NotificationButton/>

      {/* Client Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <ClientCarousel />
      </motion.div>
    </div>
  );
};

export default HomePage;
