
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Icon from './Icon';

const Header: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e5e0d8]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Left Nav (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
          <NavLink to="/story" className={navLinkClass}>Our Story</NavLink>
          <NavLink to="/craft" className={navLinkClass}>Craftsmanship</NavLink>
        </nav>
        
        {/* Mobile Menu Icon */}
        <button className="md:hidden text-text-main">
          <Icon name="menu" />
        </button>
        
        {/* Logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group">
          <Icon name="local_fire_department" className="text-primary text-3xl" />
          <span className="font-serif text-2xl font-bold tracking-tight text-text-main group-hover:text-primary transition-colors">
            Pitalya
          </span>
        </Link>
        
        {/* Right Nav & Actions */}
        <div className="flex items-center gap-4 md:gap-8">
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/journal" className={navLinkClass}>Journal</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          </nav>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-[#f4f3f0] rounded-full transition-colors">
              <Icon name="search" className="text-[20px]" />
            </button>
            <button className="p-2 hover:bg-[#f4f3f0] rounded-full transition-colors relative">
              <Icon name="shopping_cart" className="text-[20px]" />
              <span className="absolute top-1 right-0.5 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <button className="hidden md:block p-2 hover:bg-[#f4f3f0] rounded-full transition-colors">
              <Icon name="person" className="text-[20px]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
