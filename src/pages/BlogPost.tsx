import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { supabase } from '../lib/supabase';
import { Loader2, ChevronLeft } from 'lucide-react';
import { BlogPost } from './BlogList';
import { useTranslation } from 'react-i18next';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (!error && data) {
          setPost(data);
        }
      } catch (err) {
        console.error("Error fetching post", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-iris-500/60" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-serif mb-4">{t('blog.not_found')}</h1>
        <Link to="/blog" className="text-iris-500 hover:underline">
          ← {t('blog.back')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-slate hover:text-iris-500 mb-8">
        <ChevronLeft className="w-4 h-4" /> {t('blog.back')}
      </Link>
      
      <Card className="p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-serif mb-4">{post.title}</h1>
        <div className="text-sm text-slate mb-8 pb-8 border-b border-slate/10">
          {t('blog.published', { date: new Date(post.created_at).toLocaleDateString() })}
        </div>
        
        <div className="prose dark:prose-invert max-w-none text-ink-100 dark:text-paper whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
      </Card>
    </div>
  );
};
