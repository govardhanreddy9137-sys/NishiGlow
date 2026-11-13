import React from 'react';
import { BRAND } from '../data/siteData';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function LegalPages({ type, setActivePage }) {
  const isPrivacy = type === 'privacy';

  return (
    <div className="relative overflow-hidden text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      
      <button
        onClick={() => {
          setActivePage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="rounded-3xl bg-slate-900/90 border border-purple-500/25 p-8 sm:p-12 backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {isPrivacy ? 'Privacy Policy' : 'Terms & Conditions'}
            </h1>
            <p className="text-xs text-slate-400">Effective Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {isPrivacy ? (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              At <strong>{BRAND.name}</strong>, accessible via our official website, Gmail, and Instagram, protecting the privacy and creative assets of our visitors and clients is of the utmost priority.
            </p>

            <h3 className="text-base font-bold text-white pt-2">1. Information We Collect</h3>
            <p>
              When you submit an enquiry or contact us through Gmail or Instagram, we only collect information necessary to execute your creative project, such as your name, email address, and project briefs/references.
            </p>

            <h3 className="text-base font-bold text-white pt-2">2. How We Use Your Information</h3>
            <p>
              Your contact details are strictly used to communicate regarding your service requests, provide progress updates, support account sign-in, and deliver finalized high-definition digital deliverables. We never sell, lease, or distribute your email address or Instagram contact details to third-party telemarketers.
            </p>

            <h3 className="text-base font-bold text-white pt-2">3. Confidentiality of Client Media</h3>
            <p>
              Any proprietary footage, product assets, logos, or raw voiceovers provided by you for video editing or AI creation remain your exclusive property.
            </p>

            <h3 className="text-base font-bold text-white pt-2">4. 100% Online Service Model</h3>
            <p>
              All customer interactions, project reviews, and transactions are conducted remotely online across India.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              Welcome to <strong>{BRAND.name}</strong>. By ordering services or interacting with our digital studio, you agree to comply with and be bound by the following Terms & Conditions.
            </p>

            <h3 className="text-base font-bold text-white pt-2">1. Scope of Online Services</h3>
            <p>
              NISHIGLOWSTUDIO provides 100% digital creative services including AI advertisement videos, video editing, poster designing, logo designing, YouTube thumbnail creation, and business card designs. All deliverables are provided digitally via cloud links.
            </p>

            <h3 className="text-base font-bold text-white pt-2">2. Pricing & Payments</h3>
            <p>
              Our transparent price list is published on our website. Custom quotes and payment terms are agreed upon through Gmail or Instagram prior to project commencement. Payments are accepted through verified online channels (UPI, Net Banking).
            </p>

            <h3 className="text-base font-bold text-white pt-2">3. Revisions Policy</h3>
            <p>
              We provide prompt minor revisions (text adjustments, color calibration, pacing adjustments) within the agreed project scope. Major conceptual overhauls requested after delivery may incur standard package fees.
            </p>

            <h3 className="text-base font-bold text-white pt-2">4. Intellectual Property</h3>
            <p>
              Upon full payment, the client receives commercial rights for the finalized digital deliverables created specifically for their order.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
