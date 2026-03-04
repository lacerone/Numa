import Link from 'next/link';
import { getPublishedPosts } from '@/lib/notion';

export default async function Home() {
  const posts = await getPublishedPosts();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Il mio blog</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="border rounded-lg overflow-hidden shadow-lg">
            {post.cover && (
              <img
                src={post.cover}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-2">{post.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{post.author}</span>
                <span>{new Date(post.date).toLocaleDateString('it-IT')}</span>
              </div>
              {post.tags.length > 0 && (
                <div className="mt-2 flex gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="bg-gray-200 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export const revalidate = 60;