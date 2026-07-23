import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  Building2,
  MessageSquare,
  ShieldCheck,
  User,
  AtSign,
  HelpCircle,
  ChevronDown,
  PhoneCall,
  ExternalLink,
  MessageCircle,
  Award,
  Users
} from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Buying Property",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const categories = [
    "Buying Property",
    "Selling Property",
    "Rental / Lease",
    "Investment Advice",
    "General Inquiry"
  ];

  const contactCards = [
    {
      icon: PhoneCall,
      title: "Call Us Direct",
      desc: "Speak with our real estate expert",
      detail: "+91 98765 43210",
      action: "tel:+919876543210",
      actionText: "Call Now",
      iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
      borderColor: "border-blue-100 dark:border-blue-900/30"
    },
    {
      icon: Mail,
      title: "Email Support",
      desc: "Fast response within 2 hours",
      detail: "support@realestate.com",
      action: "mailto:support@realestate.com",
      actionText: "Send Email",
      iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
      borderColor: "border-indigo-100 dark:border-indigo-900/30"
    },
    {
      icon: MapPin,
      title: "Head Office",
      desc: "In-person consultation & coffee",
      detail: "Corporate Hub, Sector 62, Noida, UP",
      action: "#map-section",
      actionText: "View Location",
      iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
      borderColor: "border-emerald-100 dark:border-emerald-900/30"
    },
    {
      icon: Clock,
      title: "Working Hours",
      desc: "Mon - Sat: 9:00 AM - 8:00 PM",
      detail: "Sunday: By Appointment",
      badge: "🟢 Open Today",
      iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
      borderColor: "border-amber-100 dark:border-amber-900/30"
    }
  ];

  const faqs = [
    {
      q: "How fast will I get a callback after submitting the form?",
      a: "Our customer success advisors respond within 30 minutes during business hours (9 AM - 8 PM IST)."
    },
    {
      q: "Are property site visits and consultations free?",
      a: "Yes, 100%! All site visits, virtual property walkthroughs, and initial strategy calls are completely free."
    },
    {
      q: "Do you offer home loan assistance and legal verification?",
      a: "Yes. We collaborate with leading banks for instant pre-approvals and provide complete title verification services."
    },
    {
      q: "How can I list my property for sale or rent?",
      a: "Simply select 'Selling Property' in the form above or head to your dashboard to post a property listing."
    }
  ];

  const stats = [
    { label: "Avg Response Time", value: "< 30 Mins", icon: Clock },
    { label: "Satisfied Clients", value: "18,000+", icon: Users },
    { label: "Verified Listings", value: "12,500+", icon: ShieldCheck },
    { label: "Client Rating", value: "4.9 / 5.0", icon: Award }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      category: "Buying Property",
      message: ""
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 font-sans relative overflow-hidden">
      {/* Background Soft Subtle Blur Accents */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-200/40 dark:bg-blue-900/20 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full filter blur-3xl pointer-events-none" />

      {/* Hero Header Section */}
      <div className="relative pt-6 pb-12 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-5 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>We'd Love to Hear From You</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4"
        >
          Let’s Build Something{" "}
          <span className="text-blue-600 dark:text-blue-400">
            Extraordinary Together
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg text-gray-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Have questions about buying, selling, or investing in premium real estate? 
          Our expert advisors are ready to guide you every step of the way.
        </motion.p>
      </div>

      {/* Stats Counter Bar */}
      <div className="max-w-6xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-md"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 border-r border-gray-100 dark:border-slate-700/60 last:border-none">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Main Grid: Info Cards & Form */}
      <div className="max-w-6xl mx-auto pb-16">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards & Office Details (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="mb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Get in Touch Directly</h2>
              <p className="text-gray-500 dark:text-slate-400 text-xs">
                Choose the most convenient way to connect with our team.
              </p>
            </div>

            <div className="grid gap-3.5">
              {contactCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.01, x: 3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`p-4 rounded-xl bg-white dark:bg-slate-800 border ${card.borderColor} shadow-sm hover:shadow-md transition-all group`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3.5">
                      <div className={`p-3 rounded-xl ${card.iconBg} shrink-0`}>
                        <card.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{card.title}</h3>
                          {card.badge && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                              {card.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{card.desc}</p>
                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1.5">{card.detail}</p>
                      </div>
                    </div>

                    {card.action && (
                      <a
                        href={card.action}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-gray-600 dark:text-slate-300 transition-colors"
                        title={card.actionText}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Live Chat Box */}
            <div className="p-5 rounded-xl bg-blue-600 text-white shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-2.5 bg-white/20 rounded-lg text-white">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-blue-600 rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">Need Instant Assistance?</h4>
                  <p className="text-xs text-blue-100">Live chat advisors available 24/7</p>
                </div>
              </div>
              <button
                onClick={() => alert("Connecting you to our live chat representative...")}
                className="px-3.5 py-1.5 text-xs font-semibold bg-white text-blue-600 hover:bg-blue-50 rounded-lg shadow transition-all"
              >
                Chat Now
              </button>
            </div>
          </motion.div>

          {/* Right Column: Contact Form (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-slate-700/80 shadow-lg"
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                /* Success Message State */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-10 px-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Received!</h3>
                  <p className="text-gray-600 dark:text-slate-300 text-sm max-w-md mx-auto mb-6">
                    Thank you for reaching out. One of our senior real estate consultants will get back to you within <span className="text-emerald-600 dark:text-emerald-400 font-semibold">30 minutes</span>.
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={resetForm}
                    className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium rounded-xl text-sm transition-all shadow-md"
                  >
                    Send Another Message
                  </motion.button>
                </motion.div>
              ) : (
                /* Form Input State */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Send Us a Message</h2>
                    <p className="text-gray-500 dark:text-slate-400 text-xs">
                      Fill in the details below and we’ll customize our recommendation for you.
                    </p>
                  </div>

                  {/* Category Selector Pills */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                      I am interested in
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            formData.category === cat
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email Row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Somesh Bhatnagar"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 dark:bg-slate-900/60 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <AtSign className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="somesh@example.com"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 dark:bg-slate-900/60 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 dark:bg-slate-900/60 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Your Message *
                    </label>
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="4"
                        placeholder="Tell us about your property requirements, budget, or preferred location..."
                        className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 dark:bg-slate-900/60 border border-gray-300 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 group text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>

                  <p className="text-center text-xs text-gray-500 dark:text-slate-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Your contact details are kept 100% confidential.</span>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

      {/* Map & Office Address Showcase */}
      <div id="map-section" className="max-w-6xl mx-auto pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-md grid lg:grid-cols-12"
        >
          {/* Map info */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-3 border border-emerald-200 dark:border-emerald-800/40">
                <Building2 className="w-3.5 h-3.5" />
                <span>Visit Corporate Office</span>
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Our Location</h3>
              <p className="text-gray-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
                Drop by our flagship office for a face-to-face real estate consultation, property portfolio review, or investment planning.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-gray-700 dark:text-slate-300 text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>Real Estate Tower, Sector 62, Noida, Uttar Pradesh 201309</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-slate-300 text-xs sm:text-sm">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>+91 (0120) 456-7890</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-slate-300 text-xs sm:text-sm">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>contact@realestateapp.com</span>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white rounded-xl font-medium text-xs sm:text-sm transition-all border border-gray-200 dark:border-slate-600"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400" />
            </a>
          </div>

          {/* Interactive Google Maps Embed */}
          <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto min-h-[280px]">
            <iframe
              title="Office Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14009.680608560888!2d77.36214535!3d28.61714545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5456ef36d9f%3A0x3b7191b128613621!2sSector%2062%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="max-w-4xl mx-auto pb-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold mb-2 border border-purple-200 dark:border-purple-800/40">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700/80 rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-gray-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 dark:text-slate-400 transition-transform duration-300 shrink-0 ${
                    activeFaq === idx ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-4 pb-4 text-gray-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-gray-100 dark:border-slate-700/60 pt-3">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
