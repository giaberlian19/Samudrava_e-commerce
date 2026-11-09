"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearAuthAccount,
  getAuthAccount,
  subscribeToAuthChanges,
  type AuthAccount,
} from "@/service/authService";

export default function NavBar() {
  // State untuk menu responsif, daftar kategori, dan tampilan saat halaman digulir.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [account, setAccount] = useState<AuthAccount | null>(null);

  // Menutup seluruh menu setelah pengunjung memilih tujuan navigasi.
  function closeMenus() {
    setIsMenuOpen(false);
    setIsCategoryOpen(false);
    setIsAccountOpen(false);
  }

  // Memuat status akun dan memperbaruinya setelah login atau logout.
  useEffect(() => {
    function updateAccount() {
      setAccount(getAuthAccount());
    }

    updateAccount();
    return subscribeToAuthChanges(updateAccount);
  }, []);

  // Mengubah tampilan navbar ketika posisi halaman tidak lagi di bagian atas.
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 0);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // Header navigasi utama yang tetap terlihat saat halaman digulir.
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        isScrolled
          ? "border-white/20 bg-white/20 shadow-sm backdrop-blur-md"
          : "border-cyan-100 bg-white"
      }`}
    >
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between px-6 py-4"
      >
        {/* Identitas merek sekaligus tautan kembali ke beranda. */}
        <Link
          href="/"
          onClick={closeMenus}
          className="text-2xl font-bold tracking-tight text-cyan-950 transition-colors hover:text-cyan-700"
        >
          Samudrava
        </Link>

        {/* Tombol buka/tutup navigasi khusus tampilan layar kecil. */}
        <button
          type="button"
          aria-label={isMenuOpen ? "Tutup navigasi" : "Buka navigasi"}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          className="rounded-lg p-2 text-cyan-950 transition-colors hover:bg-cyan-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700 md:hidden"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6"
          >
            {isMenuOpen ? (
              <path d="m6 6 12 12M18 6 6 18" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Kumpulan tautan navigasi dan menu kategori. */}
        <div
          id="primary-navigation"
          className={`${isMenuOpen ? "flex" : "hidden"} w-full flex-col gap-2 border-t border-slate-100 pt-4 md:flex md:w-auto md:flex-row md:items-center md:gap-6 md:border-0 md:pt-0`}
        >
          <Link
            href="/"
            onClick={closeMenus}
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-cyan-50 hover:text-cyan-800"
          >
            Beranda
          </Link>
          {/* Menu dropdown untuk menuju bagian kategori produk. */}
          <div className="relative">
            <button
              type="button"
              aria-label="Kategori produk"
              aria-expanded={isCategoryOpen}
              aria-controls="category-menu"
              onClick={() => setIsCategoryOpen((isOpen) => !isOpen)}
              className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-cyan-50 hover:text-cyan-800 md:w-auto"
            >
              Kategori
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-4 w-4 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 7.47a.75.75 0 0 1 1.06 0L10 11.19l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.53a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isCategoryOpen && (
              <div
                id="category-menu"
                className="absolute left-0 z-10 mt-2 w-full min-w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg md:w-52"
              >
                <ul aria-label="Kategori produk">
                  {["Elektronik", "Fashion", "Kosmetik", "Rumah Tangga"].map(
                    (category) => (
                      <li key={category}>
                        <Link
                          href="/#kategori"
                          onClick={closeMenus}
                          className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-cyan-50 hover:text-cyan-800 focus-visible:outline-2 focus-visible:outline-cyan-700"
                        >
                          {category}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </div>
          {/* Akses keranjang dan autentikasi pengguna. */}
          <Link
            href="/"
            onClick={closeMenus}
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-cyan-50 hover:text-cyan-800"
          >
            keranjang
          </Link>
          {account ? (
            <div className="relative">
              <button
                type="button"
                aria-expanded={isAccountOpen}
                aria-controls="account-menu"
                onClick={() => setIsAccountOpen((isOpen) => !isOpen)}
                className="flex items-center gap-2 rounded-lg border border-cyan-200 px-3 py-2 text-sm font-semibold text-cyan-950 transition-colors hover:bg-cyan-50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-700 text-white">
                  {account.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-36 truncate">{account.name}</span>
                <span aria-hidden="true">{isAccountOpen ? "▲" : "▼"}</span>
              </button>
              {isAccountOpen && (
                <div
                  id="account-menu"
                  className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
                >
                  <p className="truncate font-semibold text-slate-900">
                    {account.name}
                  </p>
                  <p className="mt-1 truncate text-sm text-slate-600">
                    {account.email}
                  </p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-cyan-800">
                    {account.role ?? "Akun"}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      clearAuthAccount();
                      closeMenus();
                    }}
                    className="mt-4 w-full rounded-lg bg-slate-100 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-red-50 hover:text-red-700"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/form/login"
                onClick={closeMenus}
                className="rounded-md px-3 py-2 text-sm font-semibold text-cyan-800 transition-colors hover:bg-cyan-50 hover:text-cyan-600"
              >
                Masuk
              </Link>
              <Link
                href="/form/register"
                onClick={closeMenus}
                className="rounded-lg bg-cyan-700 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
