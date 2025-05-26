import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

export default function Home() {
  const handleSocialClick = (url: string) => {
    // Mengirim URL ke proses utama untuk dibuka di browser eksternal
    if (window.ipcRenderer) {
      window.ipcRenderer.send("open-external-url", url);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[url('/src/assets/home-bg.jpg')] bg-cover bg-no-repeat bg-center  items-center justify-between text-wrap">
      <span className=" text-gray-700 text-3xl text-center font-bold mt-5 w-1/2">
        Sistem Pendukung Keputusan Pemilihan Jurusan di SMK Wira Buana
        Menggunakan Metode Simple Additive Weighting (SAW)
      </span>
      <span className=" text-gray-700 text-justify w-3/5 text-lg ">
        Aplikasi desktop berbasis metode SAW membantu siswa memilih jurusan
        terbaik berdasarkan minat, nilai akademik, fasilitas, dan biaya. Sistem
        ini mengolah data secara objektif untuk memberikan rekomendasi jurusan
        berperingkat, memudahkan pengambilan keputusan sesuai potensi siswa
        dengan antarmuka yang user-friendly.
      </span>
      <div className="mb-5 flex flex-col items-center gap-2">
        <span className="text-gray-700 text-lg font-bold mb-4">
          KONTAK KAMI :
        </span>
        <div className="flex flex-row justify-center gap-40 w-full">
          <a
            onClick={() =>
              handleSocialClick("https://www.instagram.com/sekolahwirabuana/")
            }
            className="flex flex-col items-center gap-1"
          >
            <FaInstagram size={30} color="#dd2f22" />
            <p className="text-gray-700 select-none">Instagram</p>
          </a>
          <a
            onClick={() =>
              handleSocialClick(
                "https://www.facebook.com/profile.php?id=100057923451698"
              )
            }
            className="flex flex-col items-center gap-1"
          >
            <FaFacebook size={30} color="#1877f2" />
            <p className="text-gray-700 select-none">Facebook</p>
          </a>
          <a
            onClick={() => handleSocialClick("https://wa.me/6282130837700")}
            className="flex flex-col items-center gap-1"
          >
            <FaWhatsapp size={30} color="#25D366" />
            <p className="text-gray-700 select-none">WhatsApp</p>
          </a>
        </div>
      </div>
    </div>
  );
}
