import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/" className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/10">
            <img
              src="/logo.png"
              alt="Numa"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-3xl font-bold font-serif text-black tracking-tight">
  Numa
</span>
        </Link>
      </div>
    </header>
  );
}