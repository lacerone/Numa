import Link from 'next/link';
import { getPublishedPosts } from '@/lib/notion';
import Image from 'next/image';

export default async function Home() {
  const posts = await getPublishedPosts();

  if (posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Nessun articolo pubblicato.</p>
      </div>
    );
  }

  const [latestPost, ...otherPosts] = posts;

  const ArticleCard = ({ post, isLarge = false }: { post: any; isLarge?: boolean }) => {
  const formattedDate = new Date(post.date).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '.');

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article
        className={`
          border border-gray-200 hover:border-primary rounded-xl overflow-hidden 
          shadow-sm hover:shadow-md transition-all duration-300
          ${isLarge ? 'mb-12' : ''}
        `}
      >
        <div className={`flex flex-col md:flex-row ${isLarge ? 'p-6 md:p-8' : 'p-4 md:p-6'}`}>
          {/* Colonna testo */}
          <div className="flex-1 md:pr-6 flex flex-col min-h-[200px]">
            <div className="text-xs text-gray-500 uppercase tracking-wider leading-tight">
              <div>{formattedDate}</div>
              <div className="text-gray-600 mt-0.5">{post.author}</div>
            </div>

            <h2 className={`font-serif font-bold mt-2 mb-2 group-hover:text-primary transition-colors ${
              isLarge ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'
            }`}>
              {post.title}
            </h2>

            {post.description && (
              <p className={`text-gray-600 mb-4 line-clamp-3 ${
                isLarge ? 'text-base' : 'text-sm'
              }`}>
                {post.description}
              </p>
            )}

            <div className="mt-auto pt-4">
              <span className="inline-block text-xs font-semibold uppercase bg-primary text-white px-3 py-1 rounded-md">
                {post.tags[0]?.toUpperCase() || 'ARTICOLO'}
              </span>
            </div>
          </div>

          {/* Colonna immagine */}
          {post.cover && (
            <div className={`mt-4 md:mt-0 flex-shrink-0 flex justify-center ${
              isLarge ? 'md:w-64' : 'md:w-48'
            }`}>
              <Image
                src={post.cover}
                alt={post.title}
                width={isLarge ? 256 : 160} // 64*4 = 256, 40*4 = 160 (valori in pixel)
                height={isLarge ? 256 : 160}
                className="object-cover rounded-xl"
                // --- Nuove proprietà di ottimizzazione ---
                sizes={isLarge
                  ? '(max-width: 768px) 256px, 256px' // Per l'articolo grande, usa una dimensione fissa
                  : '(max-width: 768px) 160px, 160px' // Per gli altri, una dimensione fissa
                }
                // La proprietà priority è riservata all'immagine principale sopra la piega.
                // Non la mettiamo qui perché queste card potrebbero essere sotto.
              />
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <ArticleCard post={latestPost} isLarge={true} />
      {otherPosts.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {otherPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}