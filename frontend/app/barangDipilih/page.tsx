import Link from "next/link";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function BarangDipilihPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Pilih barang yang ingin dilihat
        </h1>
        <p className="mt-3 max-w-lg text-slate-600">
          Buka salah satu produk dari daftar untuk melihat foto dan deskripsinya.
        </p>
        <Link
          href="/#produk"
          className="mt-6 rounded-lg bg-cyan-700 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-800"
        >
          Lihat produk
        </Link>
      </section>
      <Footer />
    </main>
  );
}