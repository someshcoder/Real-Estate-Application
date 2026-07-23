import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Award,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Target,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Star,
  Compass,
  Globe,
  Mail,
  Linkedin,
  Github,
  Phone,
  Clock,
  MapPin,
  ChevronRight
} from 'lucide-react';

const stats = [
  {
    icon: Building2,
    value: '12,500+',
    label: 'Properties Sold & Leased',
    desc: 'Across premium residential & commercial hubs',
    color: 'from-blue-500 to-cyan-500',
    bgLight: 'bg-blue-50/80 text-blue-600 border-blue-100',
    bgDark: 'dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50'
  },
  {
    icon: Users,
    value: '18,000+',
    label: 'Satisfied Families',
    desc: 'Trusted by home buyers & investors nationwide',
    color: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50/80 text-emerald-600 border-emerald-100',
    bgDark: 'dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50'
  },
  {
    icon: Award,
    value: '25+ Years',
    label: 'Industry Leadership',
    desc: 'Award-winning excellence & domain expertise',
    color: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-50/80 text-amber-600 border-amber-100',
    bgDark: 'dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50'
  },
  {
    icon: ShieldCheck,
    value: '99.2%',
    label: 'Client Satisfaction',
    desc: 'Verified legal clearance & transparent deals',
    color: 'from-purple-500 to-indigo-500',
    bgLight: 'bg-purple-50/80 text-purple-600 border-purple-100',
    bgDark: 'dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50'
  }
];

const timelineEvents = [
  {
    year: '2000',
    title: 'The Foundation',
    desc: 'Established with a simple mission: bring clarity, honesty, and professional rigour to real estate buying.'
  },
  {
    year: '2008',
    title: 'Metropolitan Expansion',
    desc: 'Expanded operations to cover premier luxury residential sectors and commercial developments.'
  },
  {
    year: '2016',
    title: 'Digital PropTech Launch',
    desc: 'Pioneered digital verification, 3D property walkthroughs, and online legal concierge tools.'
  },
  {
    year: '2021',
    title: '$1.5B+ Milestone',
    desc: 'Crossed $1.5 Billion in cumulative property transaction volume while maintaining 99%+ client approval.'
  },
  {
    year: '2026',
    title: 'AI-Powered Future',
    desc: 'Empowering 18,000+ clients through intelligent property matching, smart valuation, and instant support.'
  }
];

const coreValues = [
  {
    icon: ShieldCheck,
    title: 'Trust & Transparency',
    desc: 'Zero hidden fees, 100% verified legal documentations, and clear communication every step of the journey.'
  },
  {
    icon: Target,
    title: 'Uncompromising Quality',
    desc: 'We strictly vet every listing to ensure superior construction, legal compliance, and premier locations.'
  },
  {
    icon: HeartHandshake,
    title: 'Client-Centric Dedication',
    desc: 'Your goals are our North Star. We tailor our advisory to your budget, lifestyle, and long-term financial growth.'
  },
  {
    icon: Sparkles,
    title: 'Next-Gen PropTech',
    desc: 'Combining modern technology with human expertise to make property search smooth, fast, and enjoyable.'
  }
];

const teamMembers = [
  {
    name: 'Somesh Bhatnagar',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: 'Visionary entrepreneur with 15+ years leading real estate innovation and PropTech digital platforms.',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com'
  },
  {
    name: 'Ananya Sharma',
    role: 'Head of Strategy & Acquisitions',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    bio: 'Specialist in luxury residential portfolios, market valuation analytics, and institutional investments.',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com'
  },
  {
    name: 'Vikramaditya Roy',
    role: 'Chief Architectural Advisor',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    bio: 'Award-winning architectural consultant ensuring property structural excellence and sustainable designs.',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com'
  },
  {
    name: 'Priya Nair',
    role: 'Director of Customer Experience',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    bio: 'Passionate about delivering hassle-free client onboarding, concierge assistance, and post-sale care.',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com'
  }
];

const testimonials = [
  {
    quote: 'Finding our dream penthouse was effortless with Somesh & Team. The transparency and legal support were unmatched!',
    name: 'Rajesh & Meera Malhotra',
    role: 'Homeowners in Cyber Hub',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    quote: 'The data-driven investment advice helped me double my real estate portfolio yield within 3 years. Highly recommended!',
    name: 'Aarav Mehta',
    role: 'Property Investor',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    quote: 'Professionalism at its finest. From initial inquiry to final possession keys, everything was handled seamlessly.',
    name: 'Sophia Chen',
    role: 'Commercial Lease Client',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  }
];

const About = () => {
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden font-sans">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Animated Background Gradients & Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/15 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-indigo-500/15 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Tag Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span>Redefining Premier Living & PropTech Solutions</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white mb-6"
          >
            Your Most Trusted Ally in <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Real Estate & Modern Living
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10"
          >
            For over two decades, we’ve guided families, entrepreneurs, and global investors to their dream properties—combining unyielding integrity, verified transparency, and cutting-edge digital experiences.
          </motion.p>

          {/* Hero Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-4"
          >
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>Explore Properties</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200"
            >
              <span>Get in Touch</span>
            </Link>
          </motion.div>
        </div>

        {/* Hero Visual Banner Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60 dark:border-slate-800 max-w-6xl mx-auto group"
        >
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80"
            alt="Modern luxury real estate architecture"
            className="w-full h-[380px] sm:h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          {/* Floating Glass Badges */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-wrap items-center justify-between gap-4">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl max-w-md">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Verified Premium Estates</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                100% legal due-diligence check on all luxury villas, apartments, and land parcels.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-3 bg-blue-600/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl border border-blue-400/30 shadow-xl">
              <Star className="w-6 h-6 fill-amber-300 text-amber-300" />
              <div>
                <p className="text-lg font-extrabold leading-none">4.9 / 5.0 Rating</p>
                <p className="text-xs text-blue-100 mt-1">Based on 3,500+ verified customer reviews</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className={`p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border ${stat.bgLight} ${stat.bgDark} transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden group`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full transition-opacity group-hover:opacity-20`} />
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/50 dark:border-slate-700/50`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">
                      Verified
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {stat.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story & Legacy Section */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Compass className="w-4 h-4" />
              <span>Who We Are & Our Journey</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
              Building Trust & Delivering Dream Homes For Over 25 Years
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Founded and spearheaded by <strong className="text-slate-900 dark:text-white">Somesh & Team</strong>, our platform was created with a clear imperative: to remove ambiguity from property dealings and give clients total confidence when buying, selling, or leasing real estate.
            </p>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              We combine deep real estate advisory experience with next-generation digital search tools. Whether you’re looking for a cozy modern apartment, a luxury penthouse, or strategic commercial land, our team ensures every step is seamless and stress-free.
            </p>

            {/* Checkmark Bullets */}
            <div className="space-y-3 mb-8">
              {[
                'Strictly vetted property titles with legal clearance',
                'Transparent pricing with zero hidden commissions',
                'Dedicated 1-on-1 concierge & financial advisory',
                'AI-driven smart property recommendations'
              ].map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-md transition-all duration-200"
            >
              <span>Schedule a Free Consultation</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right Visual Image Box */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury real estate architectural design"
                className="w-full h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 dark:border-slate-800">
                <p className="text-xs uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider mb-1">
                  Our Promise
                </p>
                <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base font-semibold">
                  “We don't just sell spaces; we craft long-term trust and help you secure the ideal foundation for your family’s future.”
                </p>
              </div>
            </div>

            {/* Accent Floating Badge */}
            <div className="absolute -top-6 -left-6 hidden sm:flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800">
              <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Top PropTech Firm</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Excellence Award 2025</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Milestones Timeline */}
      <section className="py-20 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Our Journey of Milestones
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
              Key moments that shaped our transformation into a premier real estate portal.
            </p>
          </div>

          {/* Timeline Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10">
            {timelineEvents.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTimelineIndex(idx)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  activeTimelineIndex === idx
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {item.year}
              </button>
            ))}
          </div>

          {/* Active Milestone Card */}
          <motion.div
            key={activeTimelineIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200/80 dark:border-slate-700/80 text-center relative overflow-hidden"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-sm font-bold mb-4">
              Year {timelineEvents[activeTimelineIndex].year}
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              {timelineEvents[activeTimelineIndex].title}
            </h3>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              {timelineEvents[activeTimelineIndex].desc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Target className="w-4 h-4" />
            <span>What We Stand For</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Guided By Uncompromising Values
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Every transaction, advice, and service recommendation is grounded in these core principles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((val, idx) => {
            const IconComp = val.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
                className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <IconComp className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {val.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Leadership & Team Section */}
      <section className="py-20 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Meet Our Leadership & Advisory Team
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
              Seasoned real estate experts, architects, and PropTech innovators committed to your success.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-700/80 group hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex gap-3 text-white">
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-colors">
                        <Github className="w-4 h-4" />
                      </a>
                      <a href="mailto:info@realestate.com" className="p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-colors">
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
                      {member.role}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials & Reviews */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Words of Appreciation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            What Our Clients Say About Us
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Real stories from homeowners, property sellers, and commercial investors.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-slate-700 dark:text-slate-300 text-base italic leading-relaxed mb-6">
                  "{test.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {test.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {test.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-10 sm:p-16 text-center shadow-2xl"
        >
          {/* Animated Background Orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              Ready to Turn Your Property Dreams into Reality?
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 leading-relaxed mb-8">
              Whether you are looking to buy your forever home, sell an asset at top market value, or consult with our advisors—we are here for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/search"
                className="px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-blue-700 font-bold shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Browse All Listings
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 rounded-xl bg-blue-900/60 hover:bg-blue-900/80 border border-white/30 text-white font-bold backdrop-blur-md transition-all duration-200"
              >
                Contact Concierge
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;