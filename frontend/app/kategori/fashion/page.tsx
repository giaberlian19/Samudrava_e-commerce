import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FashionImage from "@/public/image/fashion.jpg";

export default function FashionPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="mx-auto grid min-h-[70vh] w-full max-w-7xl gap-10 px-6 py-16 sm:px-8 lg:grid-cols-2 lg:items-center lg:px-12">
        <div className="relative min-h-80 overflow-hidden rounded-2xl bg-slate-100 sm:min-h-104">
          <Image
            src={FashionImage}
            alt="Koleksi fashion"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-700">
            Kategori produk
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Fashion
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600">
            Temukan pilihan fashion untuk melengkapi gaya dan kebutuhanmu.
          </p>
          <Link
            href="/#kategori"
            className="mt-7 inline-flex items-center justify-center rounded-lg bg-cyan-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-800"
          >
            Kembali ke kategori
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
