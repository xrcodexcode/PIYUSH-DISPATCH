'use client';

import React, { useState, useEffect } from 'react';
import { cn, formatDate } from '@/lib/utils';
import { sanitizeSlug, sanitizeUserText, safeLocalStorageSet } from '@/lib/security';

interface CommentItem {
  id: string;
  author: string;
  isAuthor?: boolean;
  avatarColor: string;
  content: string;
  date: string;
  likes: number;
}

interface IssueCommentsProps {
  slug: string;
  issueTitle: string;
  substackUrl: string;
}

const AVATAR_COLORS = [
  'bg-amber-600',
  'bg-emerald-600',
  'bg-sky-600',
  'bg-indigo-600',
  'bg-rose-600',
  'bg-teal-600',
  'bg-purple-600',
];

function sanitizeCommentItem(raw: unknown): CommentItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  const id = typeof obj.id === 'string' ? sanitizeUserText(obj.id, 80) : '';
  const author = typeof obj.author === 'string' ? sanitizeUserText(obj.author, 60) : 'Fellow Engineer';
  const isAuthor = Boolean(obj.isAuthor);
  const avatarColor = typeof obj.avatarColor === 'string' && (AVATAR_COLORS.includes(obj.avatarColor) || obj.avatarColor === 'bg-[var(--accent)]')
    ? obj.avatarColor
    : AVATAR_COLORS[0];
  const content = typeof obj.content === 'string' ? sanitizeUserText(obj.content, 1000) : '';
  const date = typeof obj.date === 'string' ? obj.date : new Date().toISOString();
  const likes = typeof obj.likes === 'number' && Number.isFinite(obj.likes) ? Math.max(0, Math.min(10000, Math.floor(obj.likes))) : 0;

  if (!id || !content) return null;

  return {
    id,
    author: author || 'Fellow Engineer',
    isAuthor,
    avatarColor,
    content,
    date,
    likes,
  };
}

export function IssueComments({ slug, issueTitle, substackUrl }: IssueCommentsProps) {
  const cleanSlug = sanitizeSlug(slug);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Seed default author discussion prompt if empty
  const getDefaultComments = React.useCallback((): CommentItem[] => [
    {
      id: `author-prompt-${cleanSlug}`,
      author: 'Piyush (Author)',
      isAuthor: true,
      avatarColor: 'bg-[var(--accent)]',
      content: `What was your biggest takeaway from "${sanitizeUserText(issueTitle, 120)}"? Drop your thoughts, questions, or counter-arguments below!`,
      date: new Date(Date.now() - 86400000).toISOString(),
      likes: 5,
    },
  ], [cleanSlug, issueTitle]);

  useEffect(() => {
    try {
      const storageKey = `comments_${cleanSlug}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validated = parsed
            .map(sanitizeCommentItem)
            .filter((c): c is CommentItem => c !== null)
            .slice(0, 50);
          
          if (validated.length > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setComments(validated);
          } else {
            setComments(getDefaultComments());
          }
        } else {
          setComments(getDefaultComments());
        }
      } else {
        setComments(getDefaultComments());
      }

      const savedLikes = localStorage.getItem(`likes_${cleanSlug}`);
      if (savedLikes) {
        const parsedLikes = JSON.parse(savedLikes);
        if (Array.isArray(parsedLikes)) {
          const safeLikes = parsedLikes
            .filter((id): id is string => typeof id === 'string' && id.length < 80)
            .slice(0, 100);
          setLikedComments(new Set(safeLikes));
        }
      }
    } catch {
      setComments(getDefaultComments());
    }
  }, [cleanSlug, issueTitle, getDefaultComments]);

  const handleLike = (id: string) => {
    const nextLiked = new Set(likedComments);
    const updatedComments = comments.map((c) => {
      if (c.id === id) {
        if (nextLiked.has(id)) {
          nextLiked.delete(id);
          return { ...c, likes: Math.max(0, c.likes - 1) };
        } else {
          nextLiked.add(id);
          return { ...c, likes: c.likes + 1 };
        }
      }
      return c;
    });

    setLikedComments(nextLiked);
    setComments(updatedComments);

    safeLocalStorageSet(`comments_${cleanSlug}`, updatedComments);
    safeLocalStorageSet(`likes_${cleanSlug}`, Array.from(nextLiked));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanContent = sanitizeUserText(content, 1000);
    if (!cleanContent) return;

    setIsSubmitting(true);
    const cleanAuthor = sanitizeUserText(name, 60) || 'Fellow Engineer';
    const colorIndex = Math.abs(cleanAuthor.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % AVATAR_COLORS.length;

    const newComment: CommentItem = {
      id: `user-${Date.now()}`,
      author: cleanAuthor,
      avatarColor: AVATAR_COLORS[colorIndex],
      content: cleanContent,
      date: new Date().toISOString(),
      likes: 1,
    };

    const nextComments = [...comments, newComment].slice(-50);
    setComments(nextComments);
    setContent('');
    setIsSubmitting(false);

    safeLocalStorageSet(`comments_${cleanSlug}`, nextComments);
  };

  return (
    <section className="mt-16 pt-10 border-t border-[var(--border-color)] space-y-8" id="discussion">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Community Discussion
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono font-bold">
              {comments.length}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">
            Exchange notes, questions, and insights with fellow readers
          </p>
        </div>

        {/* Substack Bridge Link */}
        {substackUrl && (
          <a
            href={substackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 text-xs font-mono font-bold transition-all shadow-2xs cursor-pointer"
          >
            <span>🍊 Discuss on Substack</span>
            <span aria-hidden="true">&rarr;</span>
          </a>
        )}
      </div>

      {/* New Comment Input Card */}
      <form
        onSubmit={handleSubmit}
        className="p-5 md:p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] shadow-xs space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="comment-author" className="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">
              Your Name or Handle (optional)
            </label>
            <input
              id="comment-author"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              placeholder="e.g. Alex (AI Engineer)"
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="comment-body" className="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">
            Leave your reflection or question
          </label>
          <textarea
            id="comment-body"
            required
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
            placeholder="Share your perspective, challenge a claim, or suggest an architectural nuance..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-mono text-[var(--text-secondary)]">
            Privacy-first • Stored locally in your session
          </span>
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-5 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-mono font-bold hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            Post Thought &rarr;
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => {
          const isLiked = likedComments.has(comment.id);
          const initial = comment.author.charAt(0).toUpperCase();

          return (
            <div
              key={comment.id}
              className={cn(
                "p-5 rounded-2xl border bg-[var(--surface)] text-[var(--text-primary)] space-y-3 transition-all",
                comment.isAuthor
                  ? "border-[var(--accent)]/40 bg-gradient-to-r from-[var(--surface)] to-[var(--bg)]"
                  : "border-[var(--border-color)]"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center font-mono shadow-2xs",
                      comment.avatarColor
                    )}
                  >
                    {initial}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                      {comment.author}
                    </span>
                    {comment.isAuthor && (
                      <span className="px-2 py-0.5 rounded-full bg-[var(--accent)] text-white text-[10px] font-mono font-bold">
                        Author
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                  {formatDate(comment.date)}
                </span>
              </div>

              <p className="text-sm text-[var(--text-primary)] leading-relaxed font-sans pl-9">
                {comment.content}
              </p>

              <div className="flex items-center justify-end gap-2 pt-1 pl-9">
                <button
                  onClick={() => handleLike(comment.id)}
                  aria-label="Upvote comment"
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border",
                    isLiked
                      ? "border-rose-500/40 text-rose-500 bg-rose-500/10 font-bold"
                      : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <span>{isLiked ? '❤️' : '🤍'}</span>
                  <span>{comment.likes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default IssueComments;
