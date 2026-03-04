import { getPublishedPosts, getPageBlocks } from '@/lib/notion';
import { notFound } from 'next/navigation';
import NotionBlockRenderer from '@/components/NotionBlockRenderer';
import Image from 'next/image';

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getPublishedPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const blocks = await getPageBlocks(post.id);
  const category = post.tags[0]?.toUpperCase() || 'ARTICOLO';
  const monthYear = new Date(post.date).toLocaleDateString('it-IT', {
    month: 'long',
    year: 'numeric',
  }).toUpperCase();

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Testata articolo stile Lucy */}
      <header className="mb-8 border-b border-gray-200 pb-8">
  {/* Data completa: giorno mese anno */}
  <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
    {post.title}
  </h1>

  {post.description && (
    <p className="text-xl text-gray-600 italic leading-relaxed mb-6">
      {post.description}
    </p>
  )}

  <div className="flex items-center text-sm text-gray-500">
    <span>Di {post.author}</span>
    <span className="mx-2">—</span>
    <time dateTime={post.date}>
      {new Date(post.date).toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </time>
  </div>
</header>

      {/* Immagine di copertina (senza arrotondamenti) */}
      {post.cover && (
        <div className="mb-12 -mx-4 md:mx-0">
          <Image
            src={post.cover}
            alt={post.title}
            width={1200}  // Una larghezza massima per il tuo contenitore
            height={675}  // Altezza proporzionale (es. 16:9)
            className="w-full h-auto"
            // --- Nuove proprietà di ottimizzazione ---
            priority      // <-- FONDAMENTALE per l'immagine principale
            fetchPriority="high" // Suggerimento extra al browser
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            quality={85}  // Qualità leggermente superiore per l'immagine principale (default 75)
          />
        </div>
      )}

      {/* Corpo articolo con i blocchi Notion */}
      <div className="prose prose-lg max-w-none
        prose-headings:font-serif
        prose-headings:font-bold
        prose-headings:mt-12
        prose-headings:mb-4
        prose-p:leading-relaxed
        prose-p:mb-6
        prose-p:text-gray-800
        prose-a:text-primary
        prose-a:no-underline
        hover:prose-a:underline
        prose-strong:text-gray-900
        prose-em:text-gray-600
        prose-img:rounded-none
        prose-img:shadow-md">
        {blocks.map((block: any) => (
          <NotionBlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </article>
  );
}

export const revalidate = 60;