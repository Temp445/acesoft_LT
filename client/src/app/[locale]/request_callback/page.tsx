'use client';

import React, { useRef, useState, useEffect, FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import Header from '@/components/Header';
import { FaUserTie } from "react-icons/fa6";
import { BsBuildings } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { sendWhatsappMessage } from "@/services/whatsapp/whatsappService";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import 'react-phone-number-input/style.css';
// import { env } from "@/lib/env"
import { useTranslations } from 'next-intl';
import { CountryCode } from 'libphonenumber-js';
import icon1 from '../../../assets/Images/icon2.png'
import Image from 'next/image';
import { useLocale } from 'next-intl';
const service_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const template_ID = process.env.NEXT_PUBLIC_EMAILJS_ENQ_TEMPLATE_ID || '';
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const endpoint = '/api/proxy-validate-email';

export default function RequestCallback() {
  const t = useTranslations('ProductEnquiry');
  const locale = useLocale();
  const countryCode = t('code') as CountryCode || 'IN';
  const [loading, setLoading] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phone, setPhone] = useState<string | undefined>('');
  const [phoneError, setPhoneError] = useState('');
  const form = useRef<HTMLFormElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const Text ={
    ru:'lg:text-3xl'
  }[locale] || 'lg:text-4xl'

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

    // Track conversion event for Google Ads
    // trackConversion({
    //   event: 'form_submission',
    //   form_id: 'enquiry_form',
    //   form_name: 'Enquiry Form'
    // });

    const phoneWithoutPlus = phone.replace(/[\s+]/g, '');

    const formData = {
      Full_Name: (formCurrent['Name'] as HTMLInputElement)?.value || '',
      Company_Name: formCurrent['company']?.value || '',
      Business_Email: email,
      Mobile_Number: phoneWithoutPlus,
      Location: formCurrent['location']?.value || '',
      Message: formCurrent['queries']?.value || '',
      Product_Interested: checkedProducts.map((p) => p.value).join(', '),
      Originate_From: "Ace Soft Enquiry Form",
    };

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
<div className="min-h-screen ">
  <Header />

  <div className="flex items-center justify-center py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-white via-[#FFF1DC] to-[#FFF1DC]">
    <div className="grid lg:grid-cols-2 gap-10 items-start w-full max-w-6xl animate-fadeIn">
      

      <div className="flex flex-col justify-center space-y-6 lg:mt-30">
        <h1 className={`text-2xl md:text-3xl ${Text} font-bold text-gray-700 flex flex-row gap-4`}>{t('contacts.RequestCallback')} <span><Image src={icon1} alt="icon" width={100} height={100} className='w-12 h-12 md:w-16 md:h-16 -mt-3 md:-mt-5 rotate-6' /></span></h1>
        <p className="lg:text-lg text-gray-700 leading-relaxed">
         {t('contacts.para')}
        </p>
    <div className="border border-gray-300 rounded-lg p-4 max-w-sm bg-white shadow-sm">
  <p className="text-gray-700 mb-1">{t('contacts.write')}</p>
  <a
    href="mailto:sales@acesoft.in"
    className="text-blue-600 underline font-medium hover:text-blue-800 transition"
  >
    sales@acesoft.in
  </a>
</div>

      </div>

      <div className="w-full bg-white shadow-2xl rounded-2xl p-6 sm:p-8 border border-gray-500">
        <form ref={form} onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Form.Name')}</label>
        <div className='relative'>
            <FaUserTie className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 text-lg" />
            <input
              name="Name"
              type="text"
              required
              placeholder={`${t('Form.NamePlaceholder')} *`}
              className=" pl-10 mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Form.Company')}</label>
           <div className='relative'>
             <BsBuildings className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 text-lg" />
            <input
              name="company"
              type="text"
              required
              placeholder={`${t('Form.CompanyPlaceholder')} *`}
              className="pl-10 mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
           </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Form.Email')}</label>
           <div className='relative'>
             <MdOutlineEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-700 text-lg" />
             <input
              ref={emailInputRef}
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              placeholder={`${t('Form.EmailPlaceholder')} *`}
              className="pl-10 mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
           </div>
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Form.Mobile')}</label>
            <PhoneInput
              international
              defaultCountry={countryCode}
              name="number"
              value={phone}
              onChange={setPhone}
              className="mt-1 rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 [&>input]:outline-none [&>input]:bg-transparent"
            />
            {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Form.Location')}</label>
            <div className='relative'>
             <CiLocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-700 text-lg" />
              <input
              name="location"
              type="text"
              placeholder={`${t('Form.LocationPlaceholder')} *`}
              className="pl-10 mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Form.Product')}</label>
            <div className="grid md:grid-cols-2 gap-3 mt-2">
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
                    className="h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{product}</span>
                </label>
              ))}
            </div>
            {checkboxError && (
              <p className="text-red-500 text-sm mt-1">{t('Form.CheckboxError')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Form.Queries')}</label>
            <textarea
              name="queries"
              rows={3}
              placeholder={`${t('Form.QueriesPlaceholder')} *`}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex justify-start">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
              disabled={loading}
            >
              {loading ? t('Form.Submitting') : t('Form.Submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>


  );
}
