"use client";

import { useState } from "react";
import Link from "next/link";
import BackgroundFUll from "@/components/background/fullBg";

export default function RegisterPage() {
  // State untuk data pendaftar, pesan hasil, dan status proses registrasi.
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);

  // Mengirim data pendaftar ke API dan mengosongkan formulir saat berhasil.
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPesan("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: nama,
            email: email,
            password: password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setPesan(data.message || "Registrasi gagal");
        return;
      }

      setPesan("Registrasi berhasil! Silakan login.");

      setNama("");
      setEmail("");
      setPassword("");
    } catch {
      setPesan("Tidak dapat terhubung ke server Laravel.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Latar dekoratif untuk halaman pendaftaran. */}
      <div className="relative h-56 md:absolute md:inset-0 md:h-auto">
        <BackgroundFUll />
      </div>
      {/* Formulir untuk membuat akun baru. */}
      <div className="relative z-10 flex justify-end md:min-h-screen">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md space-y-5 bg-white p-10"
        >
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Buat Akun
          </h1>

          {/* Kolom untuk nama yang akan dikaitkan dengan akun. */}
          <div>
            <label className="mb-2 block text-sm font-medium text-cyan-950">
              Nama
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 text-amber-950"
            />
          </div>

          {/* Kolom untuk alamat email akun. */}
          <div>
            <label className="mb-2 block text-sm font-medium text-cyan-950">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Kolom untuk menetapkan kata sandi akun. */}
          <div>
            <label className="mb-2 block text-sm font-medium text-cyan-950">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* Umpan balik proses dan tombol untuk mengirim pendaftaran. */}
          {pesan && <p className="text-sm text-blue-600">{pesan}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Sign Up"}
          </button>

          {/* Tautan bagi pengguna yang sudah memiliki akun. */}
          <p className="text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              href="/form/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>

          {/* Tombol ikon media sosial yang ditampilkan pada bagian bawah form. */}
          <div className="mt-4 text-center p-4">
            <div className="mt-2 flex justify-center space-x-4">
              <button
                type="button"
                className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700"
              >
                <i className="fab fa-facebook-f"></i>
              </button>
              <button
                type="button"
                className="rounded-full bg-blue-400 p-2 text-white hover:bg-blue-500"
              >
                <i className="fab fa-twitter"></i>
              </button>
              <button
                type="button"
                className="rounded-full bg-pink-600 p-2 text-white hover:bg-pink-700"
              >
                <i className="fab fa-instagram"></i>
              </button>
              <button
                type="button"
                className="rounded-full bg-blue-700 p-2 text-white hover:bg-blue-800"
              >
                <i className="fab fa-linkedin-in"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
