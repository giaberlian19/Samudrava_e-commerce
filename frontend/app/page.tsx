import Link from "next/link";
import Jumbotron from "@/public/image/jumbotronHome.jpg";
import Navbar from "@/components/navbar";
import Electronic from "@/public/image/electronic.jpg";
import Fashion from "@/public/image/fashion.jpg";
import Cosmetic from "@/public/image/cosmetic.jpg";
import HomeGoods from "@/public/image/home.jpg";
import Image from "next/image";
import { getProducts } from "@/service/productService";
import Footer from "@/components/footer";

// Data kategori yang ditampilkan pada beranda beserta gambar dan teks alternatifnya.
const categories = [
  { name: "Elektronik", image: Electronic, alt: "Perangkat elektronik" },
  { name: "Fashion", image: Fashion, alt: "Koleksi fashion" },
  { name: "Kosmetik", image: Cosmetic, alt: "Produk kosmetik" },
  { name: "Rumah Tangga", image: HomeGoods, alt: "Perlengkapan rumah tangga" },
];

export default async function Page() {
  // Mengambil daftar produk yang tersedia melalui API.
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-white">
      {/* Navigasi utama situs. */}
      <Navbar />

      {/* Jumbotron: pesan utama dan tautan untuk mulai menjelajahi produk. */}
      <section
        aria-labelledby="hero-title"
        className="relative isolate flex min-h-screen items-center overflow-hidden"
      >
        <Image
          src={Jumbotron}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-slate-950/80 via-slate-950/45 to-slate-950/10"
        />

        <div className="relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <div className="max-w-2xl text-white">
            <h1
              id="hero-title"
              className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            >
              Temukan pilihan terbaik untuk setiap kebutuhan
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-100 sm:text-lg">
              Jelajahi berbagai kategori produk pilihan dan temukan yang paling
              cocok untukmu.
            </p>

            <Link
              href="/pelanggan"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-cyan-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-800"
            >
              Jelajahi produk
            </Link>
          </div>
        </div>
      </section>

      {/* Kategori: kartu visual untuk membantu pengunjung menemukan jenis produk. */}
      <section
        id="kategori"
        aria-labelledby="categories-title"
        className="mx-auto w-full"
      >
        <div className="px-6 py-10 text-center sm:py-12">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-700">
            Pilihan untukmu
          </p>
          <h2
            id="categories-title"
            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Pilih kategori
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              href="/pelanggan"
              aria-label={`Jelajahi kategori ${category.name}`}
              key={category.name}
              className="group relative aspect-square overflow-hidden bg-slate-100 shadow-sm hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700"
            >
              <Image
                src={category.image}
                alt={category.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-300 group-hover:scale-105 brightness-75"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-slate-950/75 via-transparent to-transparent"
              />
              <h3 className="absolute inset-x-0 bottom-0 p-5 text-lg font-semibold text-white subpixel-antialiased">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Produk yang tersimpan di API, termasuk barang yang ditambahkan admin. */}
      <section
        id="produk"
        aria-labelledby="products-title"
        className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 sm:py-16 lg:px-12"
      >
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-700">
              Pilihan Samudrava
            </p>
            <h2
              id="products-title"
              className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
            >
              Produk tersedia
            </h2>
          </div>
          <Link
            href="/pelanggan"
            className="text-sm font-semibold text-cyan-800 hover:text-cyan-600"
          >
            Jelajahi produk
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-600">
            Barang tidak tersedia.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {product.name}
                </h3>
                <p className="mt-3 text-base font-semibold text-cyan-800">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(product.price)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Bagian pengenalan singkat tentang pengalaman berbelanja di Samudrava. */}
      <section
        aria-labelledby="about-title"
        className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:items-center lg:px-12"
      >
        <div className="relative min-h-80 overflow-hidden rounded-2xl bg-slate-100 sm:min-h-104">
          <Image
            src={HomeGoods}
            alt="Inspirasi produk untuk kebutuhan rumah"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-700">
            Belanja lebih mudah
          </p>
          <h2
            id="about-title"
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            Beragam kebutuhan, dalam satu tempat
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600">
            Temukan inspirasi dari kategori elektronik, fashion, kosmetik, dan
            perlengkapan rumah tangga. Jelajahi pilihan yang tersedia dan
            tentukan produk yang sesuai dengan kebutuhanmu.
          </p>
          <Link
            href="/pelanggan"
            className="mt-7 inline-flex items-center justify-center rounded-lg bg-cyan-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700"
          >
            Lihat semua produk
          </Link>
        </div>
      </section>

      {/* Footer bersama yang berisi identitas situs dan navigasi singkat. */}
      <Footer />
    </main>
  );
}
