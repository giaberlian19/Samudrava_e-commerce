import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/addToCartButton";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  getProductById,
  getProductImageUrl,
} from "@/service/productService";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  const productId = Number(id);
  if (!Number.isSafeInteger(productId) || productId < 1) {
    notFound();
  }

  const product = await getProductById(productId);
  if (!product) {
    notFound();
  }

  const imageUrl = getProductImageUrl(product.image_path);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="mx-auto grid min-h-[70vh] w-full max-w-7xl gap-10 px-6 py-12 sm:px-8 lg:grid-cols-2 lg:items-start lg:px-12">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`Foto ${product.name}`}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
            />
          ) : (
            <p className="text-slate-500">Foto belum tersedia</p>
          )}
        </div>
        <div className="max-w-2xl">
          <Link
            href="/#produk"
            className="text-sm font-semibold text-cyan-800 hover:text-cyan-600"
          >
            Kembali ke daftar produk
          </Link>
          {product.category && (
            <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-cyan-700">
              {product.category.name}
            </p>
          )}
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-5 text-2xl font-bold text-cyan-800">
            {currencyFormatter.format(product.price)}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Stok tersedia: {product.stock}
          </p>
          <section aria-labelledby="product-description-title" className="mt-8">
            <h2
              id="product-description-title"
              className="text-lg font-semibold text-slate-900"
            >
              Deskripsi produk
            </h2>
            <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
              {product.description || "Deskripsi produk belum tersedia."}
            </p>
          </section>
          <div className="mt-8 max-w-sm">
            <AddToCartButton product={product} />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
