
import React from 'react';
import Section from '../components/Section';
import Icon from '../components/Icon';

const CraftPage: React.FC = () => {
    const processSteps = [
        {
            title: 'Design & Inspiration',
            description: 'Every Kuber Brass Store piece begins as a sketch, drawing inspiration from traditional Indian motifs, temple architecture, and the natural world. Our designers blend timeless aesthetics with modern sensibilities.',
            imageUrl: 'https://picsum.photos/id/119/800/600',
            icon: 'design_services'
        },
        {
            title: 'Wax Molding',
            description: 'Using the ancient "lost-wax" technique, artisans sculpt a perfect, detailed replica of the design in beeswax. This delicate master model is the heart of the casting process.',
            imageUrl: 'https://picsum.photos/id/175/800/600',
            icon: 'palette'
        },
        {
            title: 'Casting in Fire',
            description: 'The wax model is encased in a special clay mixture and baked. The wax melts away, leaving a hollow mold. Molten brass, heated to over 900°C, is then poured into this cavity.',
            imageUrl: 'https://picsum.photos/id/1079/800/600',
            icon: 'local_fire_department'
        },
        {
            title: 'Finishing & Detailing',
            description: 'Once cooled, the clay mold is carefully broken, revealing the raw brass casting. Our craftspeople then meticulously file, grind, and sand the piece to smooth its form.',
            imageUrl: 'https://picsum.photos/id/1075/800/600',
            icon: 'construction'
        },
        {
            title: 'Polishing & Patina',
            description: 'The final step is to bring out the soul of the brass. Depending on the desired finish—be it a brilliant shine, a deep antique patina, or a modern black oxide—the piece is polished and treated by hand.',
            imageUrl: 'https://picsum.photos/id/25/800/600',
            icon: 'auto_awesome'
        }
    ];

    return (
        <div className="bg-white">
            <Section>
                <div className="text-center max-w-3xl mx-auto">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs">Our Craftsmanship</span>
                    <h1 className="font-serif text-5xl font-bold mt-3 mb-6">The Journey of a Kuber Brass Store Piece</h1>
                    <p className="text-text-subtle text-lg leading-relaxed">From a simple sketch to a timeless heirloom, each artifact undergoes a meticulous journey through the hands of our master artisans. This is a story of patience, precision, and passion.</p>
                </div>
            </Section>

            <div className="py-20">
                <div className="max-w-4xl mx-auto px-4">
                    {processSteps.map((step, index) => (
                        <div key={index} className="flex flex-col md:flex-row items-center gap-8 lg:gap-16 my-16">
                            <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                                <div className="rounded-lg overflow-hidden shadow-lg border border-gray-100">
                                    <img src={step.imageUrl} alt={step.title} className="w-full h-auto object-cover"/>
                                </div>
                            </div>
                            <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Icon name={step.icon} className="text-primary text-2xl"/>
                                    </div>
                                    <span className="font-serif text-3xl font-bold text-gray-300">0{index + 1}</span>
                                </div>
                                <h3 className="font-serif text-3xl font-bold mb-4 text-text-main">{step.title}</h3>
                                <p className="text-text-subtle leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CraftPage;
