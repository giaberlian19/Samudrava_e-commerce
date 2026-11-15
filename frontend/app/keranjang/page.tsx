import CartContents from "@/components/cartContents";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function KeranjangPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-700">
          Belanjaanmu
        </p>
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-slate-900">
          Keranjang
        </h1>
        <CartContents />
      </section>
      <Footer />
    </main>
  );
}
