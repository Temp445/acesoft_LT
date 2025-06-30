'use client'

import React from "react";
import { useEffect } from 'react';
import { motion } from "framer-motion";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import { FaAward } from "react-icons/fa";
import { AiTwotoneMessage } from "react-icons/ai";
import { ImFlag } from "react-icons/im";
import { FaPeopleGroup } from "react-icons/fa6";
import { RiCustomerService2Fill } from "react-icons/ri";
import Vision from "@/assets/Images/vision1.png";
import Values from "@/assets/Images/values.png";
import Mission from "@/assets/Images/mission.png";
import Pic1 from "@/assets/Images/Rajagopalan.png";
import Pic2 from "@/assets/Images/Rajasekaran.jpg";
import Pic3 from "@/assets/Images/Abilash.png";
import Pic4 from "@/assets/Images/Abishek.png";
import Pic5 from "@/assets/Images/Anandh1.jpg";
import { FaUserTie } from "react-icons/fa6";
import Count from "../../../components/Count";
import Image from "next/image";
import Header from "@/components/Header";
// import { trackConversion } from "@/lib/google";
import { useTranslations } from "next-intl";
import NotificationButton from "@/components/NotificationButton";
import Footer from "@/components/Footer";
import Commonbar from "@/components/Commonbar";
const AboutPage = () => {

  const t = useTranslations('About')
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const reasonsVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // trackConversion({
  //   event: 'aboutpage_view',
  //   form_id: 'n/a',
  //   form_name: 'Aboutpage Visit'
  // });

  return (

    <div>
      <Commonbar/>
      <Header />
      <div className="xxl:container w-full mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-80 md:h-100 lg:h-130 xl:h-150 w-full overflow-hidden z-10 2xl:rounded-sm"
        >
          <video
            src="/videos/People_Business.mp4"
            preload="auto"
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover "
          ></video>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 flex flex-col items-center justify-center h-full text-white px-6 text-center xl:text-start xl:items-start xl:ml-100 xml:ml-70 xl:justify-start xl:mt-30 "
          >
            <h1 className="text-lg md:text-3xl font-semibold relative inline-block mb-4 overflow-hidden after:content-[''] after:block after:w-16 xl:after:w-29 after:h-[2px] after:bg-white after:rounded after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0">
              {t('Title')}
              <span className="block w-16 h-0.5 bg-[#F7666F] absolute left-1/2 -translate-x-1/2 bottom-[-6px]"></span>
            </h1>

            <p className="text-sm md:text-base max-w-4xl leading-relaxed w-70 md:w-full xl:w-170 xl:text-2xl xl:mt-10">
            ACE Software Solutions Pvt. Ltd; {t('Description')}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="flex-wrap md:mt-10 text-justify sm:text-center justify-center px-5 lg:px-20 2xl:px-40 h-auto py-5 xl:mt-20"
        >
          <motion.p variants={itemVariants} className="py-2 text-[12px] sm:text-[16px] lg:text-lg">
         {t('para')}{" "}
            <span className="text-[#F7666F]">
              {" "}
             {t('highlight')}
            </span>{" "}
            {t('para1')}
          </motion.p>
          <motion.p variants={itemVariants} className="py-2 hidden sm:text-sm lg:block lg:text-lg " >
            {t('para2')}
           
          </motion.p>
          <motion.p variants={itemVariants} className="text-[12px] sm:text-[16px] lg:hidden">
            {t('para3')}
          </motion.p>
          <motion.p variants={itemVariants} className="py-2 text-[12px] sm:text-[16px] lg:text-lg">
            {t('para4')}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="flex flex-wrap justify-evenly w-full px-5 md:px-10 xl:mt-10 gap-10 py-5 md:py-20"
        >
          {[
            {
              img: Vision,
              title: t('Vision'),
              description: t('VisionPara')
            },
            {
              img: Mission,
              title: t('Mission'),
              description: t('MissionPara')
            },
            {
              img: Values,
              title: t('Values'),
              description: t('ValuesPara')
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="w-96"
            >
              <div className="border border-gray-300 rounded-2xl overflow-hidden">
                <Image src={item.img} alt={item.title} className="w-full h-48 object-cover" />
              </div>
              <h1 className="mt-4 text-[16px] sm:text-lg font-semibold">{item.title}</h1>
              <p className="mt-2 text-gray-600 text-[12px] sm:text-sm">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <div>
          <Count />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-10 xl:mt-20 px-4"
        >
          <h1 className="text-[#F7666F] text-sm sm:text-lg">
            {t('WhyChoose.Title')} <br />
            <span className="text-black font-semibold text-sm sm:text-lg">
            {t('WhyChoose.Subtitle')} ACE Software Solutions
            </span>
          </h1>

          <motion.div
            variants={containerVariants}
            className="flex justify-evenly items-center"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-20 xl:gap-32 mt-10">
              {[
                {
                  icon: ImFlag,
                  title: t('WhyChoose.Point1'),
                  description:t('WhyChoose.dec1')
                },
                {
                  icon: FaPeopleGroup,
                  title: t('WhyChoose.Point2'),
                  description: t('WhyChoose.dec2')
                },
                {
                  icon: AiTwotoneMessage,
                  title: t('WhyChoose.Point3'),
                  description: t('WhyChoose.dec3')
                },
                {
                  icon: BsFillEmojiSmileFill,
                  title: t('WhyChoose.Point4'),
                  description: t('WhyChoose.dec4')
                },
                {
                  icon: FaAward,
                  title: t('WhyChoose.Point5'),
                  description: t('WhyChoose.dec5')
                },
                {
                  icon: RiCustomerService2Fill,
                  title: t('WhyChoose.Point6'),
                  description: t('WhyChoose.dec6')
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={reasonsVariants}
                  className="flex flex-col items-start space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-sm sm:text-2xl">  <item.icon /> </div>
                    <h1 className="text-sm md:text-[16px] font-semibold">{item.title}</h1>
                  </div>
                  <p className="text-justify text-[12px] md:text-sm w-full sm:w-60 ml-8 flex flex-wrap pe-10 md:pe-0 text-gray-600">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="md:bg-gray-100 mt-12 md:mt-20 h-auto pb-16 px-10 sm:px-0 4xl:rounded-2xl">
          <h1 className="flex w-full justify-center py-5 font-bold text-[20px] lg:text-[24px] text-gray-800 md:mt-10">
          {t('Team.Title')}
          </h1>

          <div className="lg:mt-0 md:px-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-3">
              {[
                {
                  name: t('Team.name1'),
                  img: Pic1,
                  position: `${t('Team.position1')} ACE Software Solutions Pvt. Ltd.`,
                  description: t('Team.dec1'),
                },
                {
                  name: t('Team.name2'),
                  img: Pic2,
                  position: `${t('Team.position2')} ACE Software Solutions Pvt. Ltd.`,
                  description:t('Team.dec2'),              
                  },
                {
                  name: t('Team.name3'),
                  img: Pic3,
                  position: `${t('Team.position3')} ACE Software Solutions Pvt. Ltd.`,
                  description:t('Team.dec3'),
                },
                {
                  name: t('Team.name4'),
                  img: Pic4,
                  position: `${t('Team.position4')} ACE Software Solutions Pvt. Ltd.`,
                  description:t('Team.dec4'),
                },
                {
                  name: t('Team.name5'),
                  img: Pic5,
                  position: `${t('Team.position5')} ACE Software Solutions Pvt. Ltd.`,
                  description:t('Team.dec5'),
                },
              ].map((leader, index) => (
                <div
                  key={index}
                  className="w-full bg-white rounded-xl overflow-hidden border border-gray-200 md:border-0 shadow-lg hover:shadow-2xl transition duration-300 hover:scale-105 md:my-10"
                >
                  <div className="flex flex-col items-center p-5">
                    <div className="w-32 h-32 rounded-full overflow-hidden  shadow-lg shadow-gray-300 ">
                      {leader.img ? (
                        <Image
                          src={leader.img}
                          alt={leader.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-center"
                        />
                      ) : (
                        <div className="w-20 h-20 text-gray-500 mt-5 justify-center mx-auto"> <FaUserTie /> </div>
                      )}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-800">{leader.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 text-center">{leader.position}</p>
                  </div>
                  <div className="px-4 pb-5 text-[13px] text-gray-700  leading-relaxed text-justify  ">
                    {leader.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <NotificationButton/>
      <Footer/>
    </div>

  );
};

export default AboutPage;