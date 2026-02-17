
import React from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/Section';
import Icon from '../components/Icon';
import { articles } from '../data/mockData';
import { Article } from '../types';

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => (
    <article className="group flex flex-col gap-4 cursor-pointer">
        <Link to={`/journal/${article.slug}`}>
            <div className="overflow-hidden rounded-lg aspect-[4/5] bg-stone-200 relative">
                <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${article.imageUrl})` }}></div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-stone-900">
                    {article.category}
                </div>
            </div>
        </Link>
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium uppercase tracking-wide">
                <span>{article.date}</span>
                <span className="size-1 rounded-full bg-primary"></span>
                <span>{article.readTime} min read</span>
            </div>
            <Link to={`/journal/${article.slug}`}>
                <h3 className="text-2xl font-serif font-bold leading-tight text-stone-900 group-hover:text-primary transition-colors">
                    {article.title}
                </h3>
            </Link>
            <p className="text-stone-600 text-sm leading-relaxed line-clamp-2">
                {article.excerpt}
            </p>
            <Link to={`/journal/${article.slug}`} className="text-primary text-sm font-bold mt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform w-max">
                Read Article <Icon name="arrow_right_alt" className="text-[16px]" />
            </Link>
        </div>
    </article>
);


const JournalPage: React.FC = () => {
    return (
        <Section>
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-primary font-bold tracking-widest uppercase text-xs">Our Journal</span>
                <h1 className="font-serif text-5xl font-bold mt-3 mb-6">Stories of Craft & Heritage</h1>
                <p className="text-text-subtle text-lg">Insights into our process, the history of brass, and tips for bringing timeless beauty into your home.</p>
            </div>
            
            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {articles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center mt-20">
                <button className="border border-stone-300 text-stone-900 bg-transparent hover:bg-stone-100 font-medium py-3 px-8 rounded-lg transition-colors">
                    Load More Articles
                </button>
            </div>
        </Section>
    );
};

export default JournalPage;
