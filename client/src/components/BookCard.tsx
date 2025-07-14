'use client'

import React from 'react'
import { SlCalender } from "react-icons/sl";
import { useTranslations } from 'next-intl';

interface BookCardProps {
  onClick: () => void
}
const BookCard = ({ onClick }: BookCardProps) => {
  const t = useTranslations('Hero')
  return (
    <div className=' mt-10 md:mt-14'>
      <div className="w-full  lg:w-full mx-auto px-4 md:px-32 py-8 md:py-10   bg-[url(../assets/Images/blueBg.png)] md:rounded-xl overflow-hidden relative">

        <div className="h-[320px] md:h-96 flex flex-col items-center justify-centerborder bg-white border-gray-300 rounded-xl  p-8 shadow-lg relative">
          <div className="w-20 h-1 rounded-2xl justify-center bg-blue-500"></div>

          <div className='w-20 h-20 bg-blue-200 absolute left-0 top-0  rounded-br-full'></div>
          <div className='w-20 h-20 bg-blue-200 absolute right-0 bottom-0 rounded-tl-full'></div>


          <h1 className=" text-xl md:text-3xl font-extrabold text-center text-gray-800 mb-6 mt-3 md:mt-14 py-3 overflow-hidden text-shadow-lg ">
             {t('DemoCard.Title')}
          </h1>

          <p className="text-[12px] md:text-lg text-center text-gray-600 max-w-3xl mb-8 overflow-hidden ">
             {t('DemoCard.para')}
          </p>

          <button
           onClick={onClick}
            className=" overflow-hidden inline-flex md:mt-8 gap-3 text-sm md:text-lg items-center justify-center px-6 py-3 border border-blue-500  font-medium rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-200 shadow-lg "
          >
            <span className='mb-1'> <SlCalender className='text-xl font-bold' /> </span>   {t('button.BookDemo')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookCard