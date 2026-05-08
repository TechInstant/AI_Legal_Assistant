import React from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useBookmarks } from '../lib/useBookmarks';

interface BookmarkButtonProps {
  articleId: string;
  constitutionId: string;
  className?: string;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  articleId,
  constitutionId,
  className = '',
}) => {
  const { isBookmarked, toggle } = useBookmarks();
  const saved = isBookmarked(articleId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(articleId, constitutionId);
      }}
      title={saved ? 'Remove bookmark' : 'Save to bookmarks'}
      aria-label={saved ? 'Remove bookmark' : 'Save to bookmarks'}
      aria-pressed={saved}
      className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
        saved
          ? 'text-honey-500 bg-honey-500/10 hover:bg-honey-500/15'
          : 'text-slate dark:text-mist hover:text-iris-500 hover:bg-iris-500/5'
      } ${className}`}
    >
      {saved ? (
        <BookmarkCheck className="w-4 h-4 fill-current" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
      {saved ? 'Saved' : 'Save'}
    </button>
  );
};
