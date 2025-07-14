'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FaArrowRightLong } from "react-icons/fa6";
import { MdAddIcCall } from "react-icons/md";
import { LuMails } from "react-icons/lu";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function CallbackCard() {
  const t = useTranslations('CallbackCard');
  const router = useRouter();

const handleCallback = (url: string) => {
  localStorage.setItem('callbackDismissed', 'true');
  setShowCard(false);
  router.push(url);
};

  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 60000); 
    return () => clearTimeout(timer);
  }, []);

  if (!showCard) return null;

  return (
  <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm px-5">
  <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-white shadow-xl">
    
    <div className="relative flex flex-col md:flex-row bg-gradient-to-tr from-sky-500 to-sky-700 text-white p-6 md:p-8 gap-6">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-2">
          {t('Heading')} <span className="text-yellow-500">{t('highlight')} ?</span>
        </h2>
        <p className="text-sm mb-4">{t('Subtitle')} </p>
        <button
          onClick={() => handleCallback('/request_callback')}
          className="inline-block bg-red-500 hover:bg-red-600 px-5 py-2 text-sm font-semibold rounded">
        {t('contact')}
        </button>
      </div>

    <div className="hidden w-full md:w-1/2 border-t md:border-t-0 md:border-l border-white/30  md:pt-0 md:pl-6 md:flex flex-col justify-start space-y-4">
  <p className="text-sm md:text-lg border rounded-tr-xl rounded-bl-xl rounded text-center py-1 px-5 w-max  font-semibold">{t('contact')}</p>


  <div className='flex flex-col gap-5 '>
    <div>
    <p className="text-sm md:text-lg font-medium flex gap-2"> <span className='border border-dashed p-1.5 rounded-full'><MdAddIcCall /></span>{t('phone')}</p>
    <a href="tel:+919840137210" className="text-sm md:text-md pl-10">+91 9840137210</a>
  </div>

  <div>
    <p className="text-sm md:text-lg font-medium flex gap-2"><span className='border border-dashed p-1.5 rounded-full'><LuMails /></span>{t('email')}</p>
    <a href="mailto:sales@acesoft.in" className="text-sm md:text-md pl-10 underline underline-offset-1">sales@acesoft.in</a>
  </div>
  </div>

</div>

      <button
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:text-red-500 hover:backdrop-blur-none transition-all duration-200 hover:scale-110"
        onClick={() => setShowCard(false)}
      >
        <AiOutlineClose size={15} />
      </button>
    </div>

<div className="bg-white px-6 py-5 rounded-b-2xl shadow-inner hidden md:block ">
  <h2 className="text-2xl font-semibold text-gray-800 mb-8 flex items-center gap-2 justify-center">
     {t('Title')}
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
   
    <div className="group relative  rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-sky-50 p-6 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="absolute -top-4 -left-4 bg-sky-100 text-sky-700 px-3 py-1 rounded border group-hover:-rotate-12 text-xs font-semibold shadow-sm">
       ACE CMS
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-sky-700 transition-colors duration-300">
     {t('feature1')}
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {t('tagline1')}
      </p>
      <Link
        href="https://home.acecms.in/"
        className=" text-sm font-semibold text-sky-600 hover:text-sky-800 transition-colors flex gap-1"
      >
        {t('LearnMore')} <FaArrowRightLong  className='mt-1'/>
      </Link>
    </div>

    <div className="group relative rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-sky-50 p-6 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="absolute -top-4 -left-4 bg-sky-100 text-sky-700 px-3 py-1 border rounded group-hover:-rotate-12 text-xs font-semibold shadow-sm">
       ACE CRM
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-sky-700 transition-colors duration-300">
      {t('feature2')}
      </h3>
      <p className="text-sm text-gray-600 mb-4">
       {t('tagline2')}
      </p>
      <Link
        href="https://crm.acesoftcloud.in/"
        className="flex text-sm font-semibold text-sky-600 hover:text-sky-800 transition-colors gap-1"
      >
        {t('LearnMore')} <FaArrowRightLong className='mt-1'/>
      </Link>
    </div>
  </div>
</div>

  </div>
</div>

  );
}
