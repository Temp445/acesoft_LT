'use client'

import Commonbar from "@/components/Commonbar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";
import { InlineWidget } from "react-calendly";
// import { env } from "@/lib/env"


const CalendlyEmbed = () => {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;

  return (
    <div >
      <div>
        <Commonbar/>
        <Header />
      </div>
      <h1 className="mt-10 text-xl md:text-2xl font-bold md:font-extrabold  text-center text-shadow-lg/20">Book A Free Demo Now!</h1>
      <div className="App">
        <InlineWidget url={calendlyUrl ?? ""} styles={{ height: '700px' }}/>
            
      </div>
      <Footer/>
    </div>
  );
};

export default CalendlyEmbed;