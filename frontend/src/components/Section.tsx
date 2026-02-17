
import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  py?: string;
}

const Section: React.FC<SectionProps> = ({ children, className = '', py = 'py-20 md:py-28' }) => {
  return (
    <section className={`${py} ${className}`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 w-full">
        {children}
      </div>
    </section>
  );
};

export default Section;
