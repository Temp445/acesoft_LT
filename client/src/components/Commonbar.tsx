"use client";
import { FC, useState, useRef, useEffect } from "react";
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { IoChevronDown } from "react-icons/io5";
import { PiGlobeSimpleLight } from "react-icons/pi";
import { useTranslations } from "next-intl";
const Commonbar: FC = () => {
  const t = useTranslations('Menu');
 
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

const languages = [
  { code: 'en', label: 'English', flag: 'us' },
  { code: 'hi', label: 'हिन्दी', flag: 'in' },
  { code: 'de', label: 'Deutsch', flag: 'de' },
  { code: 'fr', label: 'Français', flag: 'fr' },
  { code: 'es', label: 'Español', flag: 'es' },
  { code: 'it', label: 'Italiano', flag: 'it' },
  { code: 'ja', label: '日本語', flag: 'jp' },
  { code: 'zh', label: '中文', flag: 'cn' },
  { code: 'br', label: 'Português (Brasil)', flag: 'br' },
  { code: 'kr', label: '한국어', flag: 'kr' },
  { code: 'be', label: 'বাংলা', flag: 'bd' },
  { code: 'ru', label: 'русский', flag: 'ru' },

];


  const toggleDropdown = () => setIsOpen(!isOpen);

   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
 

  return (
    <div className="shadow-sm shadow-gray-200  relative z-[300] bg-teal-50">
      <nav className="container mx-auto hidden md:flex items-center justify-between md:pt-2 pb-2  px-4 md:px-0  relative  z-[300]">
      <div className="flex">

        <div className="hidden md:flex items-center space-x-4 ml-10">
       <div className="group">
           <Link
            href="https://home.acecms.in/"
            target="_blank"
            className="flex items-center text-[#2b2d42] text-sm border border-teal-50 rounded-t-md rounded-l-md   font-semibold relative px-3 py-1 transition-all duration-300 ease-in-out hover:border-black hover:bg-white hover:scale-105"
          >
            CMS
          </Link>
            <div className="hidden group-hover:block absolute top-14   w-52 bg-white border  text-black text-xs p-2 rounded z-[300]">
          {t('CMSTooltip')}
        </div>
       </div>

     <div className="group">
           <Link
            href="https://crm.acesoftcloud.in/"
            target="_blank"
            className="flex items-center text-[#2b2d42] border border-teal-50  text-sm font-semibold relative px-3 py-1 rounded-t-md rounded-l-md transition-all duration-300 ease-in-out hover:border-black hover:bg-white   hover:scale-105"
          >
            CRM
          </Link>
            <div className="hidden group-hover:block absolute top-14   w-52 bg-white border shadow-2xl text-black text-xs p-2 rounded z-[300]">
         {t('CRMTooltip')}
        </div>
       </div>

        <div className="group">
           <Link
            href="/ace-profit-ppap"
            className="flex items-center text-[#2b2d42] border border-teal-50 rounded-t-md rounded-l-md  text-sm font-semibold relative px-3 py-1  transition-all duration-300 ease-in-out hover:border-black hover:bg-white   hover:scale-105"
          >
            PPAP
          </Link>
            <div className="hidden group-hover:block absolute top-14   w-52 bg-white border shadow-2xl text-black text-xs p-2 rounded z-[300]">
          {t('PPAPTooltip')}
        </div>
       </div>

        <div className="group">
           <Link
            href="https://project.acesoftcloud.in/"
            target="_blank"
            className="flex items-center text-[#2b2d42] border border-teal-50 rounded-t-md rounded-l-md text-sm font-semibold relative px-3 py-1  transition-all duration-300 ease-in-out  hover:border-black hover:bg-white  hover:scale-105"
          >
            Project
          </Link>
            <div className="hidden group-hover:block absolute top-14   w-52 bg-white border shadow-2xl text-black text-xs p-2 rounded z-[300]">
         {t('ProjectTooltip')}
        </div>
       </div>

        </div>
      </div>

         <div className="relative z-[300]" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-1 px-2 py-1.5 mr-2  text-gray-800 rounded text-sm  transition"
          >
            <PiGlobeSimpleLight className="w-5 h-5" />
            {languages.find((l) => l.code === currentLocale)?.label}
            <IoChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <ul className="absolute right-2 mt-2 w-80 bg-white border rounded shadow-lg z-50 grid grid-cols-2 gap-1 p-2">
              {languages
                .filter((lang) => lang.code !== currentLocale)
                .map((lang) => (
                  <li key={lang.code}>
                    <Link
                      href={pathname}
                      locale={lang.code}
                      className="flex items-center gap-2 px-2 py-1 text-sm text-gray-800 hover:bg-blue-50 hover:text-[#155E95] transition rounded"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className={`fi fi-${lang.flag} w-7 h-5 block shadow-sm`} />
                      <span>{lang.label}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </div>

      </nav>

    </div>
  );
};

export default Commonbar;
