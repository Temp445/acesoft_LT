'use client'

import Marquee from "react-fast-marquee";
import Image from "next/image";

import img1 from "../assets/ClientImages/image-1.png";
import img0 from "../assets/ClientImages/image-0.png";
import img2 from "../assets/ClientImages/image-2.png";
import img3 from "../assets/ClientImages/image-3.png";
import img4 from "../assets/ClientImages/image-4.png";
import img5 from "../assets/ClientImages/image-5.png";
import img6 from "../assets/ClientImages/image-6.png";
import img7 from "../assets/ClientImages/image-7.png";
import img8 from "../assets/ClientImages/image-8.png";
import img9 from "../assets/ClientImages/image-9.png";
import img10 from "../assets/ClientImages/image-10.png";
import img11 from "../assets/ClientImages/image-11.png";
import img12 from "../assets/ClientImages/image-12.png";
import img13 from "../assets/ClientImages/image-13.png";
import img14 from "../assets/ClientImages/image-14.png";
import img15 from "../assets/ClientImages/image-15.png";
import img16 from "../assets/ClientImages/image-16.png";
import img17 from "../assets/ClientImages/image-17.png";
import img18 from "../assets/ClientImages/image-18.png";
import img19 from "../assets/ClientImages/image-19.png";
import img20 from "../assets/ClientImages/image-20.png";
import img21 from "../assets/ClientImages/image-21.png";
import img22 from "../assets/ClientImages/image-22.png";
import img23 from "../assets/ClientImages/image-23.png";
import img24 from "../assets/ClientImages/image-24.png";
import img25 from "../assets/ClientImages/image-25.png";
import img26 from "../assets/ClientImages/image-26.png";
import img27 from "../assets/ClientImages/image-27.png";
import img28 from "../assets/ClientImages/image-28.png";
import img29 from "../assets/ClientImages/image-29.png";

import { useTranslations } from "next-intl";


const ClientCarousel = () => {
  const t = useTranslations('Hero')
  const logos = [
    img0, img1, img2, img3, img4, img5, img6, img7, img8, img9,
    img10, img11, img12, img13, img14, img15, img16, img17, img18,
    img19, img20, img21, img22, img23, img24, img25, img26, img27,
    img28, img29,
  ];

  return (
    <div className="px-5 lg:px-20 mt-5 md:mt-10 z-0">
      <h1 className="text-center text-[22px] py-5 font-semibold">{t('button.OurClients')}</h1>

      <div className="py-2 md:py-4">
        <Marquee
          gradient={false}
          speed={50}
          pauseOnHover={true}
          loop={0}
        >
          {logos.concat(logos).map((logo, index) => (
            <div key={index} className="flex items-center z-0">
              <Image
                src={logo}
                alt={`Client Logo ${index + 1}`}
                className="w-32 h-20 mx-5 object-contain border border-gray-100 rounded-lg shadow-md p-2 bg-white mt-5 mb-5 transition-transform duration-300 ease-in-out hover:scale-110 z-0"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default ClientCarousel;