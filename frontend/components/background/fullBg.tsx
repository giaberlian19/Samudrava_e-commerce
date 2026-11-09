import Image from "next/image";
import BgAquatic from "@/public/image/Form-flower.jpg";

export default function BackgroundFUll() {
  return (
    // Gambar latar yang memenuhi area pembungkus halaman.
    <div className="absolute inset-0">
      <Image
        src={BgAquatic}
        alt="Background halaman"
        fill
        priority
        className="object-cover"
      />
    </div>
  );
}
