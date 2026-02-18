
import React from 'react';
import Section from '../components/Section';
import Icon from '../components/Icon';
import hero_image from '../assets/static_used/hero_forged_in_fire.jpg';
import the_beauty_of_imperfection from '../assets/static_used/the_beauty_of_imperfection.jpg';
import molding from '../assets/static_used/molding.png';
import the_pour from '../assets/static_used/the_pour.png';
import hand_finishing from '../assets/static_used/hand_moulding.png';


const StoryPage: React.FC = () => {
    return (
        <div className="flex flex-col w-full overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${hero_image}')` }}></div>
                <div className="absolute inset-0 bg-black/40 z-0"></div>
                <div className="relative z-10 container mx-auto px-6 text-center text-white max-w-4xl">
                    <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-wide">
                        Forged in Fire, <br/> Crafted by Hand
                    </h1>
                    <p className="text-lg md:text-xl font-light opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Preserving the ancient art of Thathera in every piece. We honor the imperfect beauty of human touch.
                    </p>
                </div>
            </section>

            {/* Philosophy */}
            <Section className="bg-background-light">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 relative">
                        <div className="relative z-10 overflow-hidden rounded-xl shadow-xl">
                            <img src={the_beauty_of_imperfection} alt="Hammered brass bowl texture" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 ease-out" />
                        </div>
                        <div className="absolute -bottom-6 -left-6 w-full h-full border-2 border-primary/30 rounded-xl -z-0 hidden md:block"></div>
                    </div>
                    <div className="order-1 md:order-2 flex flex-col gap-6">
                        <span className="text-primary font-bold tracking-widest uppercase text-xs">Our Philosophy</span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-text-main leading-tight">
                            The Beauty of <span className="italic text-primary">Imperfection</span>
                        </h2>
                        <p className="text-text-subtle text-lg leading-relaxed">
                            In a world of mass production, we choose the path of the artisan. Every hammered dent and subtle variation is a testament to the human hand that shaped it. We believe that true luxury lies in these unique details.
                        </p>
                    </div>
                </div>
            </Section>

            {/* Pull Quote */}
            <Section className="bg-white border-y border-neutral-100 py-24">
                <div className="max-w-4xl mx-auto text-center">
                    <Icon name="format_quote" className="text-4xl text-primary/50 mb-6"/>
                    <h3 className="font-serif text-3xl md:text-5xl leading-tight text-text-main italic">
                        "We do not just make objects; we preserve a legacy of craftsmanship that has survived for centuries."
                    </h3>
                    <p className="text-sm font-bold uppercase tracking-wider text-text-subtle mt-8">Arjun Pitalya, Founder</p>
                </div>
            </Section>

             {/* The Process */}
            <Section className="bg-background-light">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs">The Craft</span>
                    <h2 className="font-serif text-4xl font-bold mt-3 mb-6">The Lost-Wax Method</h2>
                    <p className="text-text-subtle">A delicate dance between fire, metal, and earth. Our process remains unchanged by time.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Step 1, 2, 3 */}
                    {[
                        { title: 'Molding & Casting', img: molding, desc: 'The journey begins with a detailed wax model, encased in clay. The wax is melted away, creating a perfect void for molten brass.' },
                        { title: 'The Pour', img: the_pour, desc: 'Molten brass, heated to over 900°C, is poured into the baked clay molds. This is the moment where liquid fire takes its permanent form.' },
                        { title: 'Hand Finishing', img: hand_finishing, desc: 'Once cooled, the clay is broken away. The rough casting is then hand-filed, sanded, and polished to reveal the warm, golden luster.' }
                    ].map((step, index) => (
                        <div key={step.title} className={`group flex flex-col gap-6 ${index === 1 ? 'md:mt-16' : ''}`}>
                            <div className="aspect-[4/5] overflow-hidden rounded-lg bg-neutral-200 relative">
                                <span className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur flex items-center justify-center rounded-full font-serif text-xl font-bold z-10 shadow-sm">{index + 1}</span>
                                <img src={step.img} alt={step.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            <div>
                                <h3 className="font-serif text-2xl font-bold mb-3">{step.title}</h3>
                                <p className="text-text-subtle leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
};

export default StoryPage;
