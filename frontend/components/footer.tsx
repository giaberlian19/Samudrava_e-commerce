import Link from "next/link";

// Footer situs berisi identitas Samudrava dan tautan navigasi penting.
export default function Footer() {
  return (
    <footer className="bg-slate-950 px-6 py-10 text-slate-300 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white hover:text-cyan-200"
          >
            Samudrava
          </Link>
          <p className="mt-2 text-sm text-slate-400">
            Temukan pilihan terbaik untuk setiap kebutuhan.
          </p>
        </div>
        <nav
          aria-label="Navigasi footer"
          className="flex flex-wrap gap-x-6 gap-y-3 text-sm"
        >
          <Link href="/" className="transition-colors hover:text-white">
            Beranda
          </Link>
          <Link href="/#kategori" className="transition-colors hover:text-white">
            Kategori
          </Link>
          <Link href="/pelanggan" className="transition-colors hover:text-white">
            Produk
          </Link>
          <Link href="/form/login" className="transition-colors hover:text-white">
            Masuk
          </Link>
        </nav>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-xs text-slate-500">
        © {new Date().getFullYear()} Samudrava
      </div>
    </footer>
  );
}