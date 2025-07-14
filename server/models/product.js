const mongoose = require("mongoose");

const localizedString = {
  en: { type: String, required: true },
  be: { type: String },
  br: { type: String },
  de: { type: String },
  es: { type: String },
  fr: { type: String },
  hi: { type: String },
  it: { type: String },
  ja: { type: String },
  kr: { type: String },
  ru: { type: String },
  zh: { type: String },
};


// Benefit Schema
const benefitSchema = new mongoose.Schema({
  title: localizedString,
  description: localizedString,
});

// Customer Testimonial Schema
const customerTestimonialSchema = new mongoose.Schema({
  clientName: localizedString,
  companyName: { type: String },
  description: localizedString,
});

// Plan Schema
const planSchema = new mongoose.Schema({
  name: localizedString,
  pricedescription: localizedString,
  price: {
    type: String,
    required: true,
  },
  features: localizedString,
  
});

// Product Schema
const productSchema = new mongoose.Schema({
  imageUrl: {
    type: [String],
    required: true,
  },
  gallery: {
    type: [String],
    default: [],
  },
  productName: {
    type: String,
    required: true,
  },
  productLink: {
    type: String,
  },
  calendlyUrl: {
    type: String,
  },
  productPath: {
    type: String,
    required: true,
    unique: true,     
    index: true,      
    trim: true,
  },
  description: localizedString,
  why_choose_des: localizedString,
  who_need_des: localizedString,
  category: localizedString,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  benefits: [benefitSchema], 
  customerTestimonials: [customerTestimonialSchema], 
  plans: [planSchema],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
