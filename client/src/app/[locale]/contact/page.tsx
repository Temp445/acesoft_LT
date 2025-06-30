'use client'

import React, { useRef, useState, useEffect, FormEvent } from "react";
import { MdAddIcCall, MdOutlineMail, MdOutlineSendToMobile } from "react-icons/md";
import { FaLaptopCode } from "react-icons/fa";
import { RiCustomerService2Fill } from "react-icons/ri";
import { HiUserGroup } from "react-icons/hi2";
import { TbPhoneCall } from "react-icons/tb";
import { IoLocationOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import emailjs from "@emailjs/browser";
import Header from "@/components/Header";
// import { env } from "@/lib/env"

import { sendWhatsappMessage } from "@/services/whatsapp/whatsappService";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import { useTranslations } from "next-intl";
import { CountryCode } from 'libphonenumber-js';
import Footer from "@/components/Footer";
import Commonbar from "@/components/Commonbar";

const service_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const template_ID = process.env.NEXT_PUBLIC_EMAILJS_ENQ_TEMPLATE_ID || "";
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

const endpoint = '/api/proxy-validate-email';

const ContactUs: React.FC = () => {
  const t = useTranslations('ProductEnquiry');
  const countryCode = t('code') as CountryCode || 'IN';

  const form = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>("");
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [phoneError, setPhoneError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const [checkboxError, setCheckboxError] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateEmail = async (email: string): Promise<string> => {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });


      if (response.status !== 200) return t('Form.EmailError');

      const data = await response.json();
      if (data.success) {
        return data.isValid ? '' : t('Form.EmailError');
      } else {
        return (` Failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Email validation error:', err);
       return t('Messages.ValidationUnavailable');
    }
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const formCurrent = form.current;
    if (!formCurrent) return;

    const emailValidationMessage = await validateEmail(email);
    if (emailValidationMessage) {
      setEmailError(emailValidationMessage);

      emailInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      emailInputRef.current?.focus();
      return;
    } else {
      setEmailError('');
    }

    if (!phone || !isValidPhoneNumber(phone)) {
      setPhoneError(t('Form.PhoneError'));
      return;
    } else {
      setPhoneError('');
    }

    const checkedProducts = Array.from(formCurrent.querySelectorAll<HTMLInputElement>('input[name="product"]:checked'));
    if (checkedProducts.length === 0) {
      setCheckboxError(true);
      return;
    } else {
      setCheckboxError(false);
    }

    const phoneWithoutPlus = phone.replace(/[\s+]/g, '');

    const formData = {
      Full_Name: (formCurrent['Name'] as HTMLInputElement)?.value || '',
      Company_Name: formCurrent['company']?.value || '',
      Business_Email: email,
      Mobile_Number: phoneWithoutPlus,
      Location: formCurrent['location']?.value || '',
      Message: formCurrent['queries']?.value || '',
      Product_Interested: checkedProducts.map((p) => p.value).join(', '),
      Originate_From: 'Ace Soft Contact Page',
    };

    // Track conversion event for Google Ads
    // trackConversion({
    //   event: 'form_submission',
    //   form_id: 'enquiry_form',
    //   form_name: 'Enquiry Form'
    // });

    setLoading(true);

    try {
      await emailjs.send(service_ID, template_ID, formData, publicKey);
       alert(t('Messages.Success'));
      formCurrent.reset();
      setEmail('');
      setPhone('');
    } catch (error) {
      console.error('Email sending failed:', error);
      alert(t('Messages.Failure'));
    } finally {
      setLoading(false);
    }

    try {
      await sendWhatsappMessage(
        'enquiry_form',
        {
          originateFrom: formData.Originate_From,
          fullName: formData.Full_Name,
          companyName: formData.Company_Name,
          businessEmail: formData.Business_Email,
          mobileNumber: formData.Mobile_Number,
          location: formData.Location,
          productInterest: formData.Product_Interested,
          message: formData.Message,
        },
      );

      await sendWhatsappMessage(
        'customer_greetings',
        {
          fullName: formData.Full_Name,
          product: formData.Product_Interested,
          siteUrl: 'https://acesoft.in',
          imageUrl:
            'https://res.cloudinary.com/dohyevc59/image/upload/v1749124753/Enquiry_Greetings_royzcm.jpg',
        },
        phoneWithoutPlus,
      );
    } catch (error) {
      console.error('WhatsApp sending error:', error);
    }
  };

  return (
    <div>
      <Commonbar/>
      <Header />
      <div className="mt-0 px-2">
        <h2 className="sm:hidden w-full mx-auto text-center mt-10 mb-5 font-semibold text-[24px]">
          {t('ContactTitle')}
        </h2>
        <div className="flex flex-col md:flex-row p-4 py-10 md:py-0 rounded-lg border md:border-0 max-w-6xl mx-auto sm:mt-20 mb-20 justify-center">
          <div className="md:w-2/3">
            <h2 className="text-xl md:text-3xl font-semibold text-gray-800 mb-6">
              {t('Subtitle')}
            </h2>
            <form ref={form} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="Name" className="font-medium">
                    {t('Form.Name')}:
                  </label>
                  <input
                    type="text"
                    name="Name"
                    placeholder={`${t('Form.NamePlaceholder')} *`}
                    className="text-sm border p-2 mt-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-100"
                    required
                  />

                </div>
                <div className="flex flex-col">
                  <label htmlFor="company" className="font-medium">
                    {t('Form.Company')}:
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder={`${t('Form.CompanyPlaceholder')} *`}
                    className="text-sm border p-2 mt-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="email" className=" font-medium">
                    {t('Form.Email')}:
                  </label>
                  <input
                    ref={emailInputRef}
                    type="email"
                    name="email"
                    placeholder={`${t('Form.EmailPlaceholder')} *`}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    className="text-sm  border p-2 mt-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-100"
                    required
                  />
                  {emailError && (
                    <p id="email-error" className="text-red-500 text-sm mt-1">
                      {emailError}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="number" className=" font-medium">
                    {t('Form.Mobile')}:
                  </label>
                  <PhoneInput
                    international
                    defaultCountry={countryCode}
                    value={phone}
                    onChange={setPhone}
                    className="!shadow-none rounded !bg-transparent border mt-1 p-2 [&>input]:border-none [&>input]:outline-none [&>input]:bg-transparent"
                  />
                  {phoneError && (
                    <p className="text-red-500 text-sm mt-1">
                      {phoneError}
                    </p>
                  )}
                </div>
              </div>

              <label htmlFor="location" className=" font-medium">
               {t('Form.Location')}:
              </label>
              <input
                type="text"
                name="location"
                placeholder={`${t('Form.Location')} *`}
                className="text-sm  border p-2 mt-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-100"
                required
              />
        <div>
              <label className="block  font-medium ">{t('Form.Product')}:</label>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                {[
                  'ACE CRM',
                  'ACE PMS',
                  'ACE CMS',
                  'ACE Project',
                  'ACE Profit PPAP',
                  'PPAP Manager',
                  'ACE FAM',
                  'ACE Profit ERP',
                  'ACE Profit HRMS',
                  'ACE Payroll',
                  'ACE TMS',
                  'Engineering Balloon Annotator',
                ].map((product) => (
                  <label key={product} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="product"
                      value={product}
                      className="h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{product}</span>
                  </label>
                ))}
              </div>
              {checkboxError && (
                <p className="text-red-500 text-sm mt-1">{t('Form.CheckboxError')}</p>
              )}
            </div>
              <label className="lg:text-lg font-medium">{t('Form.Queries')}: </label>
              <textarea
                name="queries"
                placeholder={`${t('Form.QueriesPlaceholder')} *`}
                className="text-sm md:text-[16px] border p-2 mt-1 rounded w-full h-24 focus:outline-none focus:ring-2 focus:ring-red-100"
                required
              ></textarea>


              <button
                type="submit"
                disabled={loading}
                className="bg-[#F7666F] text-white px-4 py-2 rounded hover:bg-green-500"
              >
                {loading ? t('Form.Submitting') : t('Form.Submit')}
              </button>
            </form>
          </div>

          <div className="hidden lg:block md:w-1/3 md:pl-6 mt-6 md:mt-2 overflow-hidden">
            <h3 className="text-xl font-semibold">{t('contacts.directContacts')}</h3>
            <p className="text-gray-600 text-sm">
              {t('contacts.callSchedule')}
            </p>
            <p className="text-gray-700 mt-2 flex gap-2 hover:scale-105 transition text-[14px]">
              <MdAddIcCall className="mt-1" />
              {t('contacts.support')} - 44 24795144 <br />
              {t('contacts.sales')} - 44 24795145

            </p>
            <p className="text-gray-700 mt-2 flex gap-2 hover:scale-105 transition text-[14px]">
              <MdOutlineSendToMobile className="mt-1" />
              +91 9840137210
            </p>
            <p className="text-gray-700 mt-2 flex gap-2 hover:scale-105 transition text-[14px]">
              <MdOutlineMail className="mt-1" />
              sales@acesoft.in
            </p>
            <div className="mt-4 space-y-3 overflow-hidden px-3 py-2">
              <div className="bg-[#f4f5f583] border border-gray-200 p-3 rounded items-center  hover:shadow-gray-200 hover:shadow-xl hover:scale-105 transition">
                <div className="rounded flex items-center gap-4">
                  <HiUserGroup className="text-2xl text-[#f78566]" />
                  <span className="text-black font-medium">
                    {t('contacts.consult')}
                  </span>
                </div>
                <p className="text-gray-600 text-sm ml-10">
                  {t('contacts.consultSubtext')}
                </p>
              </div>

              <div className="bg-[#f4f5f583] border border-gray-200 p-3 rounded items-center  hover:shadow-gray-200 hover:shadow-xl hover:scale-105 transition">
                <div className="flex items-center gap-3">
                  <FaLaptopCode className="text-2xl text-[#7066f7]" />
                  <span className="text-black font-medium">
                    {t('contacts.customDev')}
                  </span>
                </div>
                <p className="text-gray-700 text-[13px] ml-10">
                 {t('contacts.customDevSubtext')}
                </p>
              </div>

              <div className="bg-[#f4f5f583] border border-gray-200 p-3 rounded items-center  hover:shadow-gray-200 hover:shadow-xl hover:scale-105 transition">
                <div className="flex items-center gap-3">
                  <RiCustomerService2Fill className="text-2xl text-[#6696f7]" />
                  <span className="text-black font-medium">{t('contacts.supportRequests')}</span>
                </div>
                <p className="text-gray-600 text-sm ml-10 mt-1">
                  {t('contacts.supportSubtext')}
                </p>
              </div>
            </div>

            <div className="h-0.5 w-2/4 bg-gray-300 rounded-2xl  mx-auto"></div>

            <div className="bg-[#f4f5f583] border border-gray-200 p-3 mt-3 rounded items-center  hover:shadow-gray-200 hover:shadow-xl hover:scale-105 transition mx-3 overflow-hidden">
              <div className="flex items-center gap-3">
                <FaLocationDot className="text-2xl text-[#F7666F]" />
              </div>
              <p className="text-gray-600 text-sm ml-10 px-2 -mt-5">
                {t('contacts.address')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col lg:flex-row justify-center lg:justify-evenly lg:px-20 items-center gap-6 md:gap-5 lg:gap-5 lg:h-100 px-2 md:px-5 lg:hidden">
        <div className="flex flex-row items-center gap-5 w-full border p-4 rounded-lg shadow-md">
          <TbPhoneCall className="text-2xl text-red-400 -mt-15" />
          <div>
            <p className="text-sm font-medium text-gray-500">{t('contacts.callUs')}</p>
            <p className="font-semibold text-[14px] text-black">{t('contacts.support')} - 44 24795144 <br />
              {t('contacts.sales')} - 44 24795145 <br />
              {t('contacts.Mobile')} - 97109 46806</p>
          </div>
        </div>

        <div className="flex flex-row items-center gap-5 w-full border p-4 rounded-lg shadow-md">
          <MdOutlineMail className="text-2xl text-red-400" />
          <div>
            <p className="text-sm font-medium text-gray-500">{t('contacts.emailUs')}</p>
            <p className="font-semibold text-[14px] text-black">sales@acesoft.in</p>
          </div>
        </div>

        <div className="flex flex-row  gap-5 w-full border p-4 rounded-lg shadow-md ">
          <IoLocationOutline className="text-6xl text-red-400 text-bold -mt-5" />
          <div>
            <p className="text-sm font-medium text-gray-500">{t('contacts.visitUs')}</p>
            <p className=" text-[13px] font-semibold text-black">
              {t('contacts.address')}
            </p>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ContactUs;
