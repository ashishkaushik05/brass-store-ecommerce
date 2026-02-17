
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Section from '@/components/Section';
import Icon from '@/components/Icon';
import { articles } from '@/data/mockData';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return <div className="text-center py-20">Article not found.</div>;
  }

  const otherArticles = articles.filter(a => a.slug !== slug).slice(0, 3);

  return (
    <div className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-4">
            <header className="mb-12 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-text-subtle font-medium uppercase tracking-wide mb-4">
                    <span>{article.date}</span>
                    <span className="size-1 rounded-full bg-primary"></span>
                    <span>{article.readTime} min read</span>
                </div>
                <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-text-main">
                    {article.title}
                </h1>
            </header>

            <div className="aspect-video rounded-xl overflow-hidden mb-12">
                <img src={article.imageUrl.replace('/400/500', '/1200/675')} alt={article.title} className="w-full h-full object-cover"/>
            </div>

            <article className="prose lg:prose-lg max-w-none text-text-subtle prose-headings:text-text-main prose-headings:font-serif prose-strong:text-text-main">
                <p>{article.content}</p>
            </article>
        </div>

        <Section className="border-t border-gray-100 mt-20">
            <h3 className="text-2xl font-bold font-serif text-text-main mb-8 text-center">More From The Journal</h3>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {otherArticles.map(other => (
                    <Link to={`/journal/${other.slug}`} key={other.id} className="group">
                        <div className="overflow-hidden rounded-lg aspect-[4/5] mb-4">
                            <img src={other.imageUrl} alt={other.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                        </div>
                        <h4 className="font-serif font-bold text-lg text-text-main group-hover:text-primary transition-colors">{other.title}</h4>
                        <p className="text-sm text-text-subtle">{other.excerpt}</p>
                    </Link>
                ))}
            </div>
        </Section>
    </div>
  );
};

export default ArticlePage;
