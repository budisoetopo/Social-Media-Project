export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const query = q.trim();

  if (!query) {
    return (
      <main className='pt-24 px-4 md:px-30 max-w-360 mx-auto'>
        <h1 className='text-2xl font-bold text-white mb-4'>Search</h1>
        <p className='text-neutral-400'>
          Enter a keyword to find posts, people, or tags.
        </p>
      </main>
    );
  }

  // 🔌 Replace with your real API call, e.g.:
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/search?q=${encodeURIComponent(query)}`,
  //   { cache: 'no-store' }
  // );
  // const results = await res.json();

  return (
    <main className='pt-24 px-4 md:px-30 max-w-360 mx-auto'>
      <h1 className='text-2xl font-bold text-white mb-1'>Search results</h1>
      <p className='text-sm text-neutral-400 mb-6'>
        Showing results for{' '}
        <span className='text-white font-medium'>“{query}”</span>
      </p>

      <div className='grid gap-4'>
        <div className='rounded-2xl border border-neutral-800 bg-[#111] p-4 text-sm text-neutral-400'>
          No results yet — connect your search API here.
        </div>
      </div>
    </main>
  );
}
