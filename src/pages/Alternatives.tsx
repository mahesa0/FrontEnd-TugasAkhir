import { useEffect, useState } from "react";
import {
  FaPen,
  FaTrash,
  FaTimes,
  FaPrint,
  FaPlus,
  FaFileAlt,
  FaFileExcel,
} from "react-icons/fa";
import "react-icons";
import AlternatifService from "../services/alternatifService"; // Import service alternatif
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function AlternativesPage() {
  interface Alternatif {
    _id: string;
    kodeJurusan: string;
    namaJurusan: string;
    deskripsi: string;
  }

  const [alternatif, setAlternatif] = useState<Alternatif[]>([]);
  const [editingAlternatif, setEditingAlternatif] = useState<Alternatif | null>(
    null
  );
  const [kodeJurusan, setKodeJurusan] = useState("");
  const [namaJurusan, setNamaJurusan] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // State untuk modal Tambah Alternatif
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAlternatifData, setNewAlternatifData] = useState({
    kodeJurusan: "",
    namaJurusan: "",
    deskripsi: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  // State untuk modal Laporan Alternatif
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleEdit = (alt: Alternatif) => {
    setEditingAlternatif(alt);
    setKodeJurusan(alt.kodeJurusan);
    setNamaJurusan(alt.namaJurusan);
    setDeskripsi(alt.deskripsi);
  };

  const handleSave = async () => {
    if (!editingAlternatif) return;

    if (!kodeJurusan.trim() || !namaJurusan.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        width: "47vh",
        confirmButtonColor: "#3B82F6",
        text: "Kode Jurusan dan Nama Jurusan tidak boleh kosong",
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await AlternatifService.updateAlternatifByKode(
        editingAlternatif.kodeJurusan,
        {
          kodeJurusan,
          namaJurusan,
          deskripsi,
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: response.message || `Alternatif berhasil diperbarui`,
        timer: 1300,
        showConfirmButton: false,
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });

      await fetchAlternatif();

      setEditingAlternatif(null);
    } catch (error) {
      console.error("Gagal memperbarui alternatif:", error);

      let errorMessage = "Gagal memperbarui alternatif";

      if (error && typeof error === "object") {
        if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message;
        } else {
          try {
            errorMessage = JSON.stringify(error);
          } catch (e) {
            errorMessage = String(error);
          }
        }
      }

      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        width: "53vh",
        text: errorMessage,
        confirmButtonColor: "#3B82F6",
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (kodeJurusan: string) => {
    const result = await Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Data alternatif akan dihapus secara permanen!",
      icon: "warning",
      width: "59vh",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
    });

    if (result.isConfirmed) {
      setIsDeleting(kodeJurusan);
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        await AlternatifService.deleteAlternatifByKode(kodeJurusan);

        await Swal.fire({
          title: "Terhapus!",
          text: "Alternatif berhasil dihapus.",
          icon: "success",
          timer: 1300,
          showConfirmButton: false,
          showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
        });

        await fetchAlternatif();
      } catch (error) {
        console.error("Gagal menghapus alternatif:", error);
        let errorMessage = "Gagal menghapus alternatif. Silakan coba lagi.";
        if (
          error &&
          typeof error === "object" &&
          "message" in error &&
          typeof (error as { message: string }).message === "string"
        ) {
          errorMessage = (error as { message: string }).message;
        }
        Swal.fire({
          title: "Gagal!",
          text: errorMessage,
          icon: "error",
          showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
        });
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const fetchAlternatif = async () => {
    try {
      const response = await AlternatifService.getAllAlternatif();
      if (response && Array.isArray(response.data)) {
        setAlternatif(response.data);
      } else {
        console.warn(
          "AlternatifService.getAllAlternatif returned unexpected data:",
          response
        );
        setAlternatif([]);
      }
    } catch (error) {
      console.error("Error fetching alternatif:", error);
      let errorMessage =
        "Gagal memuat data alternatif. Pastikan Anda sudah login dan server berjalan.";
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as { message: string }).message === "string"
      ) {
        errorMessage += `\n\nDetail: ${error.message}`;
      }
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });
      setAlternatif([]);
    }
  };

  useEffect(() => {
    fetchAlternatif();
  }, []);

  // Handler untuk membuka modal Tambah Alternatif
  const handleOpenCreateModal = () => {
    setNewAlternatifData({ kodeJurusan: "", namaJurusan: "", deskripsi: "" });
    setIsCreateModalOpen(true);
  };

  // Handler untuk menutup modal Tambah Alternatif
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Handler untuk input change pada form Tambah Alternatif
  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAlternatifData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler untuk submit form Tambah Alternatif
  const handleCreateAlternatif = async () => {
    if (
      !newAlternatifData.kodeJurusan.trim() ||
      !newAlternatifData.namaJurusan.trim() ||
      !newAlternatifData.deskripsi.trim()
    ) {
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        width: "47vh",
        confirmButtonColor: "#3B82F6",
        text: "Kode Jurusan, Nama Jurusan, dan Deskripsi harus diisi",
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await AlternatifService.createAlternatif(
        newAlternatifData
      );

      await Swal.fire({
        title: "Berhasil!",
        text: response.message || "Alternatif berhasil ditambahkan",
        icon: "success",
        timer: 1300,
        showConfirmButton: false,
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });

      await fetchAlternatif();
      handleCloseCreateModal();
    } catch (error: unknown) {
      console.error("Gagal membuat alternatif:", error);

      let errorMessage = "Gagal membuat alternatif. Silakan coba lagi.";

      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message: string }).message === "string"
      ) {
        errorMessage = (error as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else {
        try {
          errorMessage = JSON.stringify(error);
        } catch (e) {
          errorMessage = String(error);
        }
      }

      Swal.fire({
        title: "Gagal!",
        text: errorMessage,
        icon: "error",
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Handler untuk membuka modal Laporan Alternatif
  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  // Handler untuk menutup modal Laporan Alternatif
  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  // Handler untuk tombol print (dalam modal laporan)
  const handlePrintReport = () => {
    window.print();
  };

  // Handler untuk tombol export ke Excel (CSV) (dalam modal laporan)
  const handleExportReportExcel = () => {
    const alternatifToExport = alternatif.filter(
      (alt) =>
        alt.namaJurusan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alt.kodeJurusan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (alternatifToExport.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Tidak ada data alternatif untuk diexport.",
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });
      return;
    }

    const headers = ["Kode Jurusan", "Nama Jurusan", "Deskripsi"];
    const rows = alternatifToExport.map((alt) => {
      return [alt.kodeJurusan, alt.namaJurusan, alt.deskripsi];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "data_alternatif.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter data alternatif berdasarkan searchTerm
  const filteredAlternatif = alternatif.filter(
    (alt) =>
      alt.namaJurusan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alt.kodeJurusan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 text-gray-700">
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl">Tabel Alternatif</span>
        <div className="relative w-full sm:w-1/3 flex items-center">
          <input
            type="text"
            placeholder="Cari kode atau nama jurusan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow"
          />
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-2 text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Container untuk tombol Tambah dan Laporan */}
        <div className="flex flex-row gap-2 items-center">
          {/* Tombol Tambah Alternatif */}
          <button
            onClick={handleOpenCreateModal}
            className="bg-green-500 hover:bg-green-700 text-white rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <FaPlus size={16} />
            Tambah
          </button>

          {/* Tombol Laporan Alternatif */}
          <button
            onClick={handleOpenReportModal}
            className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <FaFileAlt size={16} />
            Laporan
          </button>
        </div>

        <span className="">
          Total Alternatif:{" "}
          <span className="border-2 border-gray-500 p-1 rounded-sm">
            {alternatif.length}
          </span>
        </span>
      </div>
      <table className="w-full ">
        <thead className="bg-gray-100">
          <tr className="border border-gray-300 text-center">
            <th className="p-2 border-r border-gray-300">Kode Jurusan</th>
            <th className="p-2 border-r border-gray-300">Nama Jurusan</th>
            <th className="p-2 border-r border-gray-300">Deskripsi</th>
            <th className="p-2 border-r border-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredAlternatif.length > 0 ? (
            filteredAlternatif.map((alt) => (
              <tr key={alt._id} className="border border-gray-300 text-center">
                <td className="p-2 border-r border-gray-300">
                  {alt.kodeJurusan}
                </td>
                <td className="p-2 border-r border-gray-300">
                  {alt.namaJurusan}
                </td>
                <td className="p-2 border-r border-gray-300">
                  {alt.deskripsi}
                </td>
                <td className="flex p-2 gap-3 flex-row justify-center text-white text-sm">
                  <button
                    onClick={() => handleEdit(alt)}
                    className=" bg-sky-500 hover:bg-sky-700 rounded p-2 flex items-center justify-center gap-1 text-white"
                  >
                    <FaPen size="15" />
                    Sunting
                  </button>
                  <button
                    onClick={() => handleDelete(alt.kodeJurusan)}
                    className="bg-red-500 hover:bg-red-800  rounded p-2 flex items-center justify-center gap-1 text-white"
                    disabled={isDeleting === alt.kodeJurusan}
                  >
                    {isDeleting === alt.kodeJurusan ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Menghapus...
                      </>
                    ) : (
                      <>
                        <FaTrash size={14} />
                        Hapus
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr className="border border-gray-300 text-center">
              <td className="p-2" colSpan={5}>
                Tidak ada data alternatif
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pop up edit */}
      <AnimatePresence>
        {editingAlternatif && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4">Edit Alternatif</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Jurusan
                  </label>
                  <input
                    type="text"
                    value={kodeJurusan}
                    onChange={(e) => setKodeJurusan(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Jurusan
                  </label>
                  <input
                    type="text"
                    value={namaJurusan}
                    onChange={(e) => setNamaJurusan(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <input
                    type="text"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setEditingAlternatif(null)}
                  className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-800 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={14} className="animate-spin inline mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop up Tambah Alternatif */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-4">
                Tambah Alternatif Baru
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Jurusan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="kodeJurusan"
                    value={newAlternatifData.kodeJurusan}
                    onChange={handleCreateInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Jurusan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaJurusan"
                    value={newAlternatifData.namaJurusan}
                    onChange={handleCreateInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="deskripsi"
                    value={newAlternatifData.deskripsi}
                    onChange={handleCreateInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleCloseCreateModal}
                  className="px-4 py-2 text-white rounded bg-red-500 hover:bg-red-800 disabled:opacity-50"
                  disabled={isCreating}
                >
                  Batal
                </button>
                <button
                  onClick={handleCreateAlternatif}
                  disabled={isCreating}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <Loader2 size={14} className="animate-spin inline mr-2" />
                      Menambahkan...
                    </>
                  ) : (
                    "Tambah"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop up Laporan Alternatif */}
      <AnimatePresence>
        {isReportModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="alternatif-report-modal-container"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col print:shadow-none print:max-w-full print:max-h-none print:overflow-visible print:p-0"
            >
              <h2 className="text-xl font-semibold mb-4 print:hidden">
                Laporan Alternatif
              </h2>

              {/* Tabel Preview Laporan */}
              <div
                id="alternatif-report-table"
                className="flex-grow overflow-y-auto mb-4 print-only print:block"
              >
                <h2 className="text-xl font-semibold mb-4 text-center print-only print:block hidden">
                  Laporan Alternatif
                </h2>
                <table className="w-full border-collapse print:border-gray-500">
                  <thead className="bg-gray-100 print:bg-gray-200">
                    <tr className="border border-gray-300 text-center print:border-gray-500">
                      <th className="p-2 border-r border-gray-300 print:border-r-gray-500 print:border-b-gray-500">
                        Kode Jurusan
                      </th>
                      <th className="p-2 border-r border-gray-300 print:border-r-gray-500 print:border-b-gray-500">
                        Nama Jurusan
                      </th>
                      <th className="p-2 print:border-b-gray-500">Deskripsi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAlternatif.length > 0 ? (
                      filteredAlternatif.map((alt) => (
                        <tr
                          key={alt._id}
                          className="border border-gray-300 text-center print:border-gray-500"
                        >
                          <td className="p-2 border-r border-gray-300 print:border-r-gray-500">
                            {alt.kodeJurusan}
                          </td>
                          <td className="p-2 border-r border-gray-300 print:border-r-gray-500">
                            {alt.namaJurusan}
                          </td>
                          <td className="p-2 print:border-r-gray-500">
                            {alt.deskripsi}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border border-gray-300 text-center print:border-gray-500">
                        <td className="p-2" colSpan={4}>
                          Tidak ada data alternatif
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 mt-4 print:hidden">
                <button
                  onClick={handlePrintReport}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                >
                  <FaPrint size={16} />
                  Cetak
                </button>

                <button
                  onClick={handleExportReportExcel}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-700 text-white rounded flex items-center gap-2"
                >
                  <FaFileExcel size={16} />
                  Export Excel
                </button>

                <button
                  onClick={handleCloseReportModal}
                  className="px-4 py-2 text-white rounded bg-red-500 hover:bg-red-800 flex items-center"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
