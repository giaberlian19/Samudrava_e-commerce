import Link from "next/link";

const categories = [
  { name: "Elektronik", href: "/kategori/eletronik" },
  { name: "Fashion", href: "/kategori/fashion" },
  { name: "Kosmetik", href: "/kategori/cosmetic" },
  { name: "Rumah Tangga", href: "/kategori/rumahTangga" },
  { name: "Olahraga", href: "/kategori/sport" },
  { name: "Makanan & Minuman", href: "/kategori/food" },
  { name: "Buku & Alat Tulis", href: "/kategori/book" },
  { name: "Bayi & Anak", href: "/kategori/baby" },
];

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-slate-950 text-slate-300">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-64 bg-linear-to-b from-cyan-950/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-40 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1.3fr_0.7fr_1fr] lg:px-12">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-white transition-colors hover:text-cyan-200"
          >
            <span className="text-2xl font-bold tracking-tight">Samudrava</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
            Temukan pilihan terbaik untuk setiap kebutuhan. Jelajahi kategori
            dan temukan produk yang cocok untukmu.
          </p>
          <Link
            href="/#produk"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-100"
          >
            Jelajahi produk <span aria-hidden="true">→</span>
          </Link>
        </div>

        <nav aria-label="Navigasi footer">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
            Navigasi
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link href="/" className="transition-colors hover:text-cyan-200">
                Beranda
              </Link>
            </li>
            <li>
              <Link
                href="/#kategori"
                className="transition-colors hover:text-cyan-200"
              >
                Semua kategori
              </Link>
            </li>
            <li>
              <Link
                href="/#produk"
                className="transition-colors hover:text-cyan-200"
              >
                Produk tersedia
              </Link>
            </li>
            <li>
              <Link
                href="/form/login"
                className="transition-colors hover:text-cyan-200"
              >
                Masuk
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Kategori produk">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
            Kategori
          </h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 text-sm">
            {categories.map((category) => (
              <li key={category.href}>
                <Link
                  href={category.href}
                  className="transition-colors hover:text-cyan-200"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>© {new Date().getFullYear()} Samudrava. Semua hak dilindungi.</p>
          <p>Dibuat untuk pengalaman belanja yang lebih mudah.</p>
        </div>
      </div>
    </footer>
  );
}
