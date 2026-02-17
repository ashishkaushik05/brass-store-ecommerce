
import React from 'react';
import Icon from '../components/Icon';

const ContactPage: React.FC = () => {
    return (
        <main className="flex-grow w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
            {/* Page Heading */}
            <div className="mb-12 lg:mb-16">
                <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-text-main mb-4">
                    Crafted Connections
                </h1>
                <p className="text-lg text-text-subtle max-w-2xl">
                    Have a question about our heritage brass collection or custom orders? We are here to help you bring timeless elegance into your home.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                {/* Left Column: Contact Form */}
                <div className="lg:col-span-7 space-y-8">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="block">
                                <span className="text-base font-medium mb-2 block">Full Name</span>
                                <input type="text" placeholder="Enter your full name" className="w-full h-12 px-4 rounded-lg bg-white border border-[#e6e2db] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                            </label>
                            <label className="block">
                                <span className="text-base font-medium mb-2 block">Email Address</span>
                                <input type="email" placeholder="Enter your email" className="w-full h-12 px-4 rounded-lg bg-white border border-[#e6e2db] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                            </label>
                        </div>
                        <label className="block">
                            <span className="text-base font-medium mb-2 block">Your Message</span>
                            <textarea placeholder="How can we assist you today?" className="w-full min-h-[160px] p-4 rounded-lg bg-white border border-[#e6e2db] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y"></textarea>
                        </label>
                        <button type="button" className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-primary hover:bg-[#d69310] text-text-main font-bold tracking-wide transition-colors shadow-sm hover:shadow-md w-full md:w-auto">
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Right Column: Info & Map */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                    <div className="bg-white p-8 rounded-xl border border-[#e6e2db] shadow-sm">
                        <h3 className="text-xl font-bold mb-6 border-b border-[#f4f3f0] pb-4">Contact Details</h3>
                        <div className="space-y-6">
                            {[
                                { icon: 'location_on', title: 'Visit Us', lines: ['123 Artisan Lane,', 'Brass City, India 302001'] },
                                { icon: 'call', title: 'Call Us', lines: ['+91 987 654 3210'] },
                                { icon: 'mail', title: 'Email Us', lines: ['hello@pitalya.com'] },
                                { icon: 'schedule', title: 'Business Hours', lines: ['Mon - Sat: 10:00 AM - 7:00 PM', 'Sunday: Closed'] }
                            ].map(item => (
                                <div key={item.title} className="flex items-start gap-4">
                                    <div className="size-10 rounded-full bg-[#fdf6e7] flex items-center justify-center shrink-0">
                                        <Icon name={item.icon} className="text-primary text-[20px]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm uppercase tracking-wide text-text-subtle mb-1">{item.title}</p>
                                        <div className="text-base leading-relaxed">{item.lines.map(line => <p key={line}>{line}</p>)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="aspect-video bg-cover bg-center rounded-xl border border-[#e6e2db]" style={{backgroundImage: "url('https://www.e-architect.com/wp-content/uploads/2019/07/how-to-create-a-fake-google-map-m010719.jpg')"}}>
                        {/* Map Placeholder */}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ContactPage;
