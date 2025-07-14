'use client';

import { Disclosure } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { IoReorderThreeOutline } from 'react-icons/io5';
import Logo from '../assets/Images/logo.svg';
import LogoLg from '../assets/Images/AceLogo.png';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, JSX } from 'react';
import { LuMessageSquareMore } from 'react-icons/lu';
import { jwtDecode } from 'jwt-decode';
import { useTranslations } from 'next-intl';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type NavigationItem = {
  name: string;
  href: string;
  className?: string;
  onClick?: () => void;
};

type DecodedToken = {
  role?: string;
  [key: string]: any;
};

export default function Header(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const t = useTranslations('Header');
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Failed to decode token:', err);
      }
    }
  }, []);

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    router.push('/login');
  };

  const navigation: NavigationItem[] = [
    { name: t('Product'), href: '/products' },
    { name: t('Contact'), href: '/contact' },
    { name: t('About'), href: '/about' },
    isAuthenticated
      ? { name: t('Logout'), href: '#', onClick: handleLogout }
      : { name: t('Login'), href: '/login', className: 'md:hidden lg:block' },
  ];

  return (
    <div className="w-full z-[200] sm:px-4 2xl:px-6 container mx-auto ">
   
      <Disclosure as="nav" className="bg-none lg:bg-white w-full fixed md:relative z-[200]">
        {({ open, close }) => (
          <>
            <div className="mx-auto  w-full">
              <div className="flex h-16 items-center justify-between">
                <Link href="/">
                  <div className="hidden md:flex flex-1 md:items-center lg:justify-start gap-1 cursor-pointer">
                    <Image src={LogoLg} width={50} height={48} alt="Company Logo" className="h-10 pl-2 xl:h-10" />
                    <span className="mt-3 flex text-[16px] sm:text-base md:mt-1 font-semibold  md:text-base xl:font-semibold">
                      ACE <span className="ml-2">Software Solutions </span>{' '}
                      <span className="hidden xl:flex ml-2">Pvt. Ltd</span>
                    </span>
                  </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden  md:block">
              <div className="flex flex-wrap items-center gap-6 overflow-x-hidden">
                  
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={(e) => {
                          if (item.onClick) {
                            e.preventDefault();
                            item.onClick();
                          }
                        }}
                        className={classNames(
                          'hover-effect-1 hover:text-white cursor-pointer rounded',
                          'rounded-md px-2 py-2 text-[12px] md:text-sm font-semibold',
                          item.className || ''
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile bottom nav */}
            <div className="md:hidden  mx-auto xl:px-0 fixed bottom-0 bg-[#128daf] w-full z-[200]  border-white overflow-hidden">
              <div className="flex h-14 items-center justify-between overflow-hidden z-[200]">
                {/* Mobile Menu Button */}
                <div className="flex items-center lg:hidden md:justify-end bg-[#fa650f] h-16 w-14 z-[200]">
                  <Disclosure.Button
                    className="relative inline-flex items-center justify-center ml-2 md:ml-0 md:mr-2 gap-3 text-white hover:text-white"
                    aria-label="Main menu"
                  >
                    {open ? (
                      <XMarkIcon className="block size-6" aria-hidden="true" />
                    ) : (
                      <IoReorderThreeOutline className="block justify-end size-7.5 font-black" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                <Link
                  href="/"
                  className="lg:hidden font-semibold text-white  items-center text-center  flex gap-2"
                >
                  <Image src={Logo} width={32} height={32} alt="Company Logo" className="h-7" />
                  <span className="mt-0.5 text-md"> ACE Software Solutions </span>{' '}
                
                </Link>

                <Link
                  href="/demo/all-products"
                  className="flex font-bold w-14 h-full justify-center  border-l border-white text-white items-center"
                >
                  <LuMessageSquareMore className="text-3xl" />
                </Link>
              </div>
            </div>

            <Disclosure.Panel className="lg:hidden fixed bg-white w-3/4 z-[100] bottom-16 rounded-lg shadow-lg">
              <div className="space-y-1 px-4 pt-2 pb-3 flex-col flex items-start">
                {navigation.map((item) => (
                  <div key={item.name} className="w-full">
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        if (item.onClick) {
                          e.preventDefault();
                          item.onClick();
                        } else {
                          close(); 
                        }
                      }}
                      className={classNames(
                        'text-gray-700 hover:bg-gray-800 hover:text-white',
                        'block rounded-md px-3 py-2 text-base text-[14px] w-full'
                      )}
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
