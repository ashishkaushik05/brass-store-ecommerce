
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const policiesContent: { [key: string]: { title: string; content: React.ReactNode } } = {
  shipping: {
    title: 'Shipping Policy',
    content: (
      <div>
        <p>We offer complimentary shipping on all orders across India. As each Pitalya piece is handcrafted with care, please allow 3-5 business days for your order to be processed and dispatched. Once shipped, you can expect delivery within 5-7 business days. You will receive a tracking number via email as soon as your order is on its way.</p>
      </div>
    )
  },
  returns: {
    title: 'Returns & Refunds',
    content: (
      <div>
        <p>We take great pride in our craftsmanship. If you are not completely satisfied with your purchase, we accept returns within 14 days of delivery for a full refund or exchange. The item must be in its original, unused condition. Please note that customized items are not eligible for return. To initiate a return, please contact our support team at hello@pitalya.com.</p>
      </div>
    )
  },
  care: {
    title: 'Care Instructions',
    content: (
      <div>
        <p>To maintain the beautiful luster of your brass artifact, please follow these simple steps:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Wipe gently with a soft, dry cloth after each use.</li>
            <li>Avoid using abrasive materials or harsh chemical cleaners.</li>
            <li>For a natural, deep clean, create a paste of lemon juice and baking soda. Apply it to the surface, let it sit for 10-15 minutes, then rinse thoroughly with warm water and dry completely.</li>
            <li>Keep away from prolonged exposure to moisture to prevent tarnishing.</li>
        </ul>
      </div>
    )
  },
  terms: {
    title: 'Terms of Service',
    content: (
      <div>
        <p>Welcome to Pitalya. By accessing or using our website, you agree to be bound by these Terms of Service and our Privacy Policy. All content on this site, including images, text, and designs, is the property of Pitalya and is protected by intellectual property laws. We reserve the right to refuse service or cancel orders at our discretion.</p>
      </div>
    )
  },
  privacy: {
    title: 'Privacy Policy',
    content: (
      <div>
        <p>Your privacy is important to us. We collect personal information such as your name, email, and shipping address solely for the purpose of processing your orders and improving your experience. We do not sell or share your information with third parties, except as required for shipping and payment processing. Our website uses cookies to enhance functionality.</p>
      </div>
    )
  },
};


const PoliciesPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const policy = policiesContent[type || ''] || { title: 'Page Not Found', content: <p>The policy you are looking for does not exist.</p> };

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex gap-2 text-sm mb-6 text-text-subtle">
            <Link to="/" className="hover:underline hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-text-main font-medium">{policy.title}</span>
        </div>
      <div className="bg-white p-10 rounded-lg border border-gray-100">
        <h1 className="text-4xl font-serif font-bold mb-8">{policy.title}</h1>
        <div className="prose lg:prose-lg max-w-none text-text-subtle prose-headings:text-text-main prose-strong:text-text-main">
          {policy.content}
        </div>
      </div>
    </main>
  );
};

export default PoliciesPage;
