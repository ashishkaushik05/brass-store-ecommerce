
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#221c10] text-white pt-20 pb-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <Icon name="local_fire_department" className="text-primary text-3xl" />
              <span className="font-serif text-2xl font-bold tracking-tight">Kuber Brass Store</span>
            </Link>
            <p className="text-text-subtle text-sm leading-relaxed max-w-xs">
              Handcrafted Brass, Rooted in Tradition. Bringing the warmth of Indian heritage to modern homes worldwide.
            </p>
            <div className="flex gap-4 mt-2">
               {/* Social Icons can be added here */}
            </div>
          </div>
          
          {/* Shop Links */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6">Shop</h4>
            <ul className="flex flex-col gap-3 text-text-subtle text-sm">
              <li><Link to="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/collections/god-idols" className="hover:text-primary transition-colors">God Idols</Link></li>
              <li><Link to="/collections/brass-utensils" className="hover:text-primary transition-colors">Brass Utensils</Link></li>
              <li><Link to="/collections/home-decor" className="hover:text-primary transition-colors">Home Decor</Link></li>
              <li><Link to="/collections/gift-items" className="hover:text-primary transition-colors">Gift Sets</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6">Company</h4>
            <ul className="flex flex-col gap-3 text-text-subtle text-sm">
              <li><Link to="/story" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link to="/craft" className="hover:text-primary transition-colors">Craftsmanship</Link></li>
              <li><Link to="/journal" className="hover:text-primary transition-colors">Journal</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          {/* Policies Links */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6">Support</h4>
            <ul className="flex flex-col gap-3 text-text-subtle text-sm">
              <li><Link to="/policies/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link to="/policies/returns" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/policies/care" className="hover:text-primary transition-colors">Care Instructions</Link></li>
              <li><Link to="/policies/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/policies/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-subtle">
          <p>© 2024 Kuber Brass Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
