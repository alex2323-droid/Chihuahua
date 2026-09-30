import React from 'react';
import { Sparkles } from 'lucide-react';

interface ProductSkeletonProps {
  layout?: 'grid-2' | 'grid-3' | 'grid-4' | 'list' | 'story' | 'gallery';
  count?: number;
  isDark?: boolean;
}

export const ProductCardSkeleton: React.FC<{
  layout?: 'grid-2' | 'grid-3' | 'grid-4' | 'list' | 'story' | 'gallery';
  isDark?: boolean;
}> = ({ layout = 'grid-3', isDark = false }) => {
  if (layout === 'list') {
    return (
      <div
        className={`rounded-2xl border p-4 flex flex-col sm:flex-row gap-4 items-center transition-all ${
          isDark
            ? 'bg-slate-900/80 border-slate-800 shadow-md'
            : 'bg-white border-slate-200/90 shadow-2xs'
        }`}
      >
        {/* Image Box */}
        <div
          className={`w-full sm:w-32 h-32 shrink-0 rounded-xl overflow-hidden relative flex items-center justify-center skeleton-shimmer ${
            isDark ? 'bg-slate-950' : 'bg-slate-100'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800/80 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-slate-400 dark:text-slate-600 opacity-60 animate-pulse" />
          </div>
        </div>

        {/* Content Box */}
        <div className="flex-1 min-w-0 w-full space-y-2.5">
          {/* Category & SKU row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-16 rounded-md skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
              <div className={`h-3 w-20 rounded-md skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            </div>
            <div className={`h-4 w-14 rounded skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          </div>

          {/* Title */}
          <div className={`h-4.5 w-3/4 rounded-md skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

          {/* Badge / Sizes chip */}
          <div className={`h-4 w-28 rounded-md skeleton-shimmer ${isDark ? 'bg-slate-800/80' : 'bg-slate-200/80'}`} />

          {/* Description line */}
          <div className={`h-3 w-5/6 rounded-md skeleton-shimmer ${isDark ? 'bg-slate-800/60' : 'bg-slate-200/60'}`} />

          {/* Price & Action row */}
          <div className="pt-2 flex items-center justify-between">
            <div className={`h-6 w-20 rounded-lg skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <div className={`h-8 w-28 rounded-xl skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'gallery') {
    return (
      <div
        className={`rounded-3xl border overflow-hidden flex flex-col transition-all ${
          isDark
            ? 'bg-slate-900/80 border-slate-800 shadow-xl'
            : 'bg-white border-slate-200/90 shadow-sm'
        }`}
      >
        {/* Large Hero Image Skeleton */}
        <div
          className={`relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden flex items-center justify-center skeleton-shimmer ${
            isDark ? 'bg-slate-950' : 'bg-slate-100'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800/80 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-slate-400 dark:text-slate-600 opacity-60 animate-pulse" />
          </div>
          {/* Floating badge skeleton */}
          <div className="absolute top-3.5 left-3.5 flex gap-2">
            <div className="h-5 w-16 rounded-full bg-slate-300 dark:bg-slate-800 skeleton-shimmer" />
            <div className="h-5 w-20 rounded-full bg-slate-300 dark:bg-slate-800 skeleton-shimmer" />
          </div>
        </div>

        {/* Details section */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Top metadata */}
            <div className="flex items-center justify-between">
              <div className={`h-3.5 w-28 rounded-md skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
              <div className={`h-4 w-16 rounded-lg skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            </div>

            {/* Title */}
            <div className={`h-6 w-4/5 rounded-lg skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

            {/* Sizes badge */}
            <div className={`h-5 w-36 rounded-lg skeleton-shimmer ${isDark ? 'bg-slate-800/80' : 'bg-slate-200/80'}`} />

            {/* Description lines */}
            <div className="space-y-1.5 pt-1">
              <div className={`h-3.5 w-full rounded-md skeleton-shimmer ${isDark ? 'bg-slate-800/60' : 'bg-slate-200/60'}`} />
              <div className={`h-3.5 w-11/12 rounded-md skeleton-shimmer ${isDark ? 'bg-slate-800/60' : 'bg-slate-200/60'}`} />
              <div className={`h-3.5 w-3/4 rounded-md skeleton-shimmer ${isDark ? 'bg-slate-800/60' : 'bg-slate-200/60'}`} />
            </div>
          </div>

          {/* Pricing & Button row */}
          <div className={`pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <div className="space-y-1">
              <div className={`h-3 w-16 rounded skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
              <div className={`h-7 w-28 rounded-lg skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            </div>
            <div className={`h-10 w-36 rounded-xl skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          </div>
        </div>
      </div>
    );
  }

  // Grid / Story Card Skeleton (Default)
  return (
    <div
      className={`rounded-2xl border overflow-hidden flex flex-col transition-all ${
        isDark
          ? 'bg-slate-900/80 border-slate-800 shadow-md'
          : 'bg-white border-slate-200/90 shadow-2xs'
      }`}
    >
      {/* Product Image Container */}
      <div
        className={`relative aspect-4/3 overflow-hidden border-b flex items-center justify-center skeleton-shimmer ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-100'
        }`}
      >
        <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800/80 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-slate-400 dark:text-slate-600 opacity-60 animate-pulse" />
        </div>
        {/* Floating chip skeleton */}
        <div className="absolute top-2.5 left-2.5">
          <div className="h-4.5 w-14 rounded-md bg-slate-300 dark:bg-slate-800 skeleton-shimmer" />
        </div>
      </div>

      {/* Product Content Container */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Metadata kicker */}
          <div className="flex items-center justify-between gap-2">
            <div className={`h-3 w-20 rounded-md skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <div className={`h-3 w-12 rounded skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          </div>

          {/* Title */}
          <div className="space-y-1">
            <div className={`h-4 w-full rounded-md skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <div className={`h-4 w-2/3 rounded-md skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          </div>

          {/* Size or tag pill */}
          <div className={`h-3.5 w-24 rounded-md skeleton-shimmer ${isDark ? 'bg-slate-800/70' : 'bg-slate-200/70'}`} />

          {/* Description */}
          <div className="space-y-1 pt-0.5">
            <div className={`h-2.5 w-full rounded skeleton-shimmer ${isDark ? 'bg-slate-800/50' : 'bg-slate-200/50'}`} />
            <div className={`h-2.5 w-4/5 rounded skeleton-shimmer ${isDark ? 'bg-slate-800/50' : 'bg-slate-200/50'}`} />
          </div>
        </div>

        {/* Price & Action Row */}
        <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div className="space-y-1">
            <div className={`h-5 w-20 rounded-md skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          </div>
          <div className={`h-8 w-24 rounded-xl skeleton-shimmer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
        </div>
      </div>
    </div>
  );
};

export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({
  layout = 'grid-3',
  count = 6,
  isDark = false,
}) => {
  const gridLayoutClass = {
    'grid-2': 'grid grid-cols-2 gap-3 sm:gap-6',
    'grid-3': 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6',
    'grid-4': 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5',
    list: 'flex flex-col gap-4',
    story: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4',
    gallery: 'grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto',
  }[layout || 'grid-3'];

  return (
    <div className={gridLayoutClass} aria-label="Cargando catálogo..." aria-busy="true">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} layout={layout} isDark={isDark} />
      ))}
    </div>
  );
};
