import { CategoryContent } from './CategoryContent';
import { CategorySlug } from '@/types/resto';
import { notFound } from 'next/navigation';

const validCategories: CategorySlug[] = [
  'all-restaurant',
  'nearby',
  'discount',
  'best-seller',
  'delivery',
  'lunch',
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const category = resolvedParams.slug as CategorySlug;

  if (!validCategories.includes(category)) {
    notFound();
  }

  return <CategoryContent category={category} />;
}
