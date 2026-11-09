"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BackgroundFUll from "@/components/background/fullBg";
import { createAuthAccount, saveAuthAccount } from "@/service/authService";

export default function LoginPage() {
  const router = useRouter();
  // State untuk nilai input, umpan balik, dan status proses masuk.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);

  // Mengirim kredensial ke API dan menampilkan hasilnya pada formulir.
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPesan("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPesan(data.message || "Login gagal");
        return;
      }

      setPesan("Login berhasil!");
      saveAuthAccount(createAuthAccount(data, email));
      setEmail("");
      setPassword("");
      router.push("/");
    } catch {
      setPesan("Tidak dapat terhubung ke server Laravel.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Latar dekoratif di belakang panel masuk. */}
      <div className="relative h-56 md:absolute md:inset-0 md:h-auto">
        <BackgroundFUll />
      </div>
      {/* Formulir masuk beserta validasi dasar dan tautan pendaftaran. */}
      <div className="relative z-10 flex justify-end md:min-h-screen">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md space-y-5 bg-white p-10"
        >
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Masuk ke Akun
          </h1>

          {/* Kolom untuk memasukkan email akun. */}
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

          {/* Kolom untuk memasukkan kata sandi akun. */}
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

          {/* Pesan hasil permintaan dan tombol untuk mengirim formulir. */}
          {pesan && <p className="text-sm text-blue-600">{pesan}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Login"}
          </button>

          {/* Tautan menuju halaman pendaftaran akun baru. */}
          <p className="text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              href="/form/register"
              className="font-semibold text-blue-600 hover:underline"
            >
              Daftar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
