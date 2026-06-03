import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  created_at: string;
  published: boolean;
}

export const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setPosts(data);
        }
      } catch (err) {
        console.error("Error fetching blog posts", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-serif mb-4">{t('blog.title')}</h1>
        <p className="text-lg text-slate dark:text-mist">
          {t('blog.subtitle')}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-iris-500/60" />
        </div>
      ) : posts.length === 0 ? (
        <Card className="p-12 text-center text-slate dark:text-mist">
          {t('blog.empty')}
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link key={post.id} to={`/blog/${post.slug}`}>
              <Card className="p-6 h-full hover:border-iris-500 transition-colors flex flex-col">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-xs text-slate mb-4">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-slate dark:text-mist line-clamp-3">
                  {post.summary}
                </p>
                <div className="mt-auto pt-4 text-iris-500 text-sm font-medium">
                  {t('blog.read_more')}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
