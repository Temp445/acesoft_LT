'use client'

import Header from "@/components/Header";
import React from "react";
import { InlineWidget } from "react-calendly";
// import { env } from "@/lib/env"


const CalendlyEmbed = () => {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;

  return (
    <div >
      <div>
        <Header />
      </div>
      <h1 className="mt-10 text-xl md:text-2xl font-bold md:font-extrabold  text-center text-shadow-lg/20">Book A Free Demo Now!</h1>
      <div className="App">
        <InlineWidget url={calendlyUrl ?? ""} />
      </div>
    </div>
  );
};

export default CalendlyEmbed;