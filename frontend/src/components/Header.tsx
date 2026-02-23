
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useUser, SignInButton, SignOutButton } from '@clerk/clerk-react';
import Icon from './Icon';
import { useCart } from '@/hooks/api/useCart';
import { CartDrawer } from './cart/CartDrawer';

const Header: React.FC = () => {
  const { user } = useUser();
  const { data: cart } = useCart();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  
  const cartItemCount = cart?.totalItems || 0;
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e5e0d8]">
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
            Kuber Brass Store
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

            {/* Cart → goes straight to checkout */}
            <button 
              onClick={() => navigate('/checkout')}
              className="p-2 hover:bg-[#f4f3f0] rounded-full transition-colors relative"
              aria-label={`Cart${cartItemCount > 0 ? ` (${cartItemCount} items)` : ''}`}
            >
              <Icon name="shopping_cart" className="text-[20px]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>

            <div className="hidden md:block relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 hover:bg-[#f4f3f0] rounded-full transition-colors"
                  >
                    <Icon name="person" className="text-[20px]" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-text-main truncate">
                          {user.fullName || user.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-text-subtle hover:bg-[#f4f3f0] transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-text-subtle hover:bg-[#f4f3f0] transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Orders
                      </Link>
                      <SignOutButton>
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#f4f3f0] transition-colors">
                          Sign Out
                        </button>
                      </SignOutButton>
                    </div>
                  )}
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="p-2 hover:bg-[#f4f3f0] rounded-full transition-colors">
                    <Icon name="person" className="text-[20px]" />
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Cart drawer still mounted for "Added to cart" slide-in feedback */}
      <CartDrawer />
    </header>
  );
};

export default Header;
