
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Section from '@/components/Section';
import Icon from '@/components/Icon';
import { useArticle } from '@/hooks/api/useArticles';
import { useArticles } from '@/hooks/api/useArticles';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading: articleLoading } = useArticle(slug || '');
  const { data: articlesData } = useArticles({ limit: 3, status: 'published' });

  if (articleLoading) {
    return <LoadingPage message="Loading article..." />;
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold font-serif text-text-main mb-4">Article Not Found</h1>
        <p className="text-text-subtle mb-8">The article you're looking for doesn't exist.</p>
        <Link
          to="/journal"
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Back to Journal
        </Link>
      </div>
    );
  }

  const otherArticles = (articlesData?.articles || [])
    .filter(a => a.slug !== slug)
    .slice(0, 3);

  const publishedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const readTime = article.readTime || 5;

  return (
    <div className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-4">
            <header className="mb-12 text-center">
                <div className="flex items-center justify-center gap-2 text-sm text-text-subtle font-medium uppercase tracking-wide mb-4">
                    <span>{publishedDate}</span>
                    <span className="size-1 rounded-full bg-primary"></span>
                    <span>{readTime} min read</span>
                </div>
                <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-text-main">
                    {article.title}
                </h1>
            </header>

            <div className="aspect-video rounded-xl overflow-hidden mb-12">
                <img 
                  src={article.featuredImage || 'https://picsum.photos/1200/675'} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
            </div>

            <article className="prose lg:prose-lg max-w-none text-text-subtle prose-headings:text-text-main prose-headings:font-serif prose-strong:text-text-main">
                <p>{article.content}</p>
            </article>
        </div>

        <Section className="border-t border-gray-100 mt-20">
            <h3 className="text-2xl font-bold font-serif text-text-main mb-8 text-center">More From The Journal</h3>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {otherArticles.map(other => (
                    <Link to={`/journal/${other.slug}`} key={other._id} className="group">
                        <div className="overflow-hidden rounded-lg aspect-[4/5] mb-4">
                            <img 
                              src={other.featuredImage || 'https://picsum.photos/600/750'} 
                              alt={other.title} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
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
