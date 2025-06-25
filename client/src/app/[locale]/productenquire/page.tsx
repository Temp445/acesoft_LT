'use client';

import React, { useRef, useState, useEffect, FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import Header from '@/components/Header';
import { sendWhatsappMessage } from "@/services/whatsapp/whatsappService";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import 'react-phone-number-input/style.css';
// import { env } from "@/lib/env"
import { useTranslations } from 'next-intl';
import { CountryCode } from 'libphonenumber-js';
const service_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const template_ID = process.env.NEXT_PUBLIC_EMAILJS_ENQ_TEMPLATE_ID || '';
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

const endpoint = '/api/proxy-validate-email';

export default function productenquire() {
  const t = useTranslations('ProductEnquiry');
  const countryCode = t('code') as CountryCode || 'IN';
  const [loading, setLoading] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phone, setPhone] = useState<string | undefined>('');
  const [phoneError, setPhoneError] = useState('');
  const form = useRef<HTMLFormElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

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
    <div>
      <Header />
      <div className="min-h-screen py-12 px-2 sm:px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-4 sm:p-8 border border-gray-200">
          <h1 className="md:text-3xl font-semibold text-center mb-6">{t('Title')}</h1>
          <form ref={form} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('Form.Name')}:</label>
              <input
                name="Name"
                type="text"
                required
                placeholder={`${t('Form.NamePlaceholder')} *`}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('Form.Company')}:</label>
              <input
                name="company"
                type="text"
                placeholder={`${t('Form.CompanyPlaceholder')} *`}
                className="mt-1 w-full rounded-md border px-3 py-2"
                required
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700">{t('Form.Email')}:</label>
              <input
                ref={emailInputRef}
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                placeholder={`${t('Form.EmailPlaceholder')} *`}
                className="mt-1 w-full rounded-md border px-3 py-2"
                required
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('Form.Mobile')}:</label>
              <PhoneInput
                international
                defaultCountry={countryCode}
                name="number"
                value={phone}
                onChange={setPhone}
                className="!shadow-none !bg-transparent rounded-md border mt-1 p-2 [&>input]:border-none [&>input]:outline-none [&>input]:bg-transparent"
              />
              {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('Form.Location')}:</label>
              <input
                name="location"
                type="text"
                placeholder={`${t('Form.LocationPlaceholder')} *`}
                className="mt-1 w-full rounded-md border px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('Form.Product')}:</label>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                {[
                  'ACE CRM',
                  'ACE Profit PPAP',
                  'PPAP Manager',
                  'ACE Profit ERP',
                  'ACE Profit HRMS',
                  'ACE Projects',
                  'Engineering Balloon Annotator',
                  'ACE Fixed Asset Management (FAM)',
                  'ACE Calibration Management System (CMS)',
                  'ACE Production Management System (PMS)',
                  'ACE Task Management System (TMS)',
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

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('Form.Queries')}:</label>
              <textarea
                name="queries"
                rows={3}
                placeholder={`${t('Form.QueriesPlaceholder')} *`}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>

            <div className="flex">
              <button
                type="submit"
                className="bg-red-400 text-white px-4 py-2 rounded hover:bg-green-500"
                disabled={loading}
              >
                {loading ? t('Form.Submitting') : t('Form.Submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
