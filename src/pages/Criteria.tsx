// pages/Report.tsx
import { useEffect, useState } from "react";
import {
  FaPen,
  FaTrash,
  FaTimes,
  FaPlus,
  FaPrint,
  FaFileAlt,
  FaFileExcel,
} from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { CriteriaService } from "../services/criteriaService";

interface Criteria {
  _id: string;
  kodeKriteria: string;
  namaKriteria: string;
  tipeKriteria: "Benefit" | "Cost";
  bobotKriteria: number;
}

export default function Criteria() {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [editingCriteria, setEditingCriteria] = useState<Criteria | null>(null);
  const [kodeKriteria, setKodeKriteria] = useState("");
  const [namaKriteria, setNamaKriteria] = useState("");
  const [tipeKriteria, setTipeKriteria] = useState<"Benefit" | "Cost">(
    "Benefit"
  );
  const [bobotKriteria, setBobotKriteria] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCriteriaData, setNewCriteriaData] = useState({
    kodeKriteria: "",
    namaKriteria: "",
    tipeKriteria: "Benefit" as "Benefit" | "Cost",
    bobotKriteria: "",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleEdit = (criteria: Criteria) => {
    setEditingCriteria(criteria);
    setKodeKriteria(criteria.kodeKriteria);
    setNamaKriteria(criteria.namaKriteria);
    setTipeKriteria(criteria.tipeKriteria);
    setBobotKriteria(criteria.bobotKriteria?.toString() ?? "");
  };

  const handleSave = async () => {
    if (!editingCriteria) return;

    if (!kodeKriteria.trim() || !namaKriteria.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        width: "47vh",
        confirmButtonColor: "#3B82F6",
        text: "Semua field harus diisi (Kode Kriteria dan Nama Kriteria)",
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatedData = {
        kodeKriteria,
        namaKriteria,
        tipeKriteria,
        bobotKriteria: parseFloat(bobotKriteria),
      };

      await CriteriaService.updateCriteria(editingCriteria._id, updatedData);
      await Swal.fire({
        title: "Berhasil!",
        text: "Kriteria berhasil diperbarui",
        icon: "success",
        timer: 1300,
        showConfirmButton: false,
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });

      const response = await CriteriaService.getAllCriteria();
      if (response && response.data) {
        setCriteria(response.data);
      }
      setEditingCriteria(null);
    } catch (error) {
      console.error("Gagal memperbarui kriteria:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      Swal.fire({
        title: "Gagal!",
        text:
          "Gagal memperbarui kriteria. Silakan coba lagi.\n\nDetail: " +
          errorMessage,
        icon: "error",
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Data kriteria akan dihapus secara permanen!",
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
      setIsDeleting(id);
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        await CriteriaService.deleteCriteria(id);

        await Swal.fire({
          title: "Terhapus!",
          text: "Kriteria berhasil dihapus.",
          icon: "success",
          timer: 1300,
          showConfirmButton: false,
          showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
        });

        const response = await CriteriaService.getAllCriteria();
        if (response && response.data) {
          setCriteria(response.data);
        }
      } catch (error) {
        console.error("Gagal menghapus kriteria:", error);
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        Swal.fire({
          title: "Gagal!",
          text:
            "Gagal menghapus kriteria. Silakan coba lagi.\n\nDetail: " +
            errorMessage,
          icon: "error",
          showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
        });
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const fetchCriteria = async () => {
    try {
      const response = await CriteriaService.getAllCriteria();
      if (response && response.data) {
        setCriteria(response.data);
      } else {
        console.warn(
          "CriteriaService.getAllCriteria returned unexpected data:",
          response
        );
        setCriteria([]);
      }
    } catch (error) {
      console.error("Error fetching criteria:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      Swal.fire({
        title: "Error",
        text:
          "Gagal memuat data kriteria. Pastikan Anda sudah login dan server berjalan.\n\nDetail: " +
          errorMessage,
        icon: "error",
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });
      setCriteria([]);
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, []);

  const handleOpenCreateModal = () => {
    setNewCriteriaData({
      kodeKriteria: "",
      namaKriteria: "",
      tipeKriteria: "Benefit",
      bobotKriteria: "",
    });
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewCriteriaData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateSave = async () => {
    if (
      !newCriteriaData.kodeKriteria.trim() ||
      !newCriteriaData.namaKriteria.trim() ||
      !newCriteriaData.tipeKriteria
    ) {
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        width: "47vh",
        confirmButtonColor: "#3B82F6",
        text: "Kode Kriteria, Nama Kriteria, dan Tipe Kriteria harus diisi",
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });
      return;
    }

    setIsCreating(true);
    try {
      const criteriaToCreate = {
        ...newCriteriaData,
        bobotKriteria: newCriteriaData.bobotKriteria
          ? parseFloat(newCriteriaData.bobotKriteria)
          : undefined,
      };

      await CriteriaService.createCriteria(criteriaToCreate);
      await Swal.fire({
        title: "Berhasil!",
        text: "Kriteria berhasil ditambahkan",
        icon: "success",
        timer: 1300,
        showConfirmButton: false,
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });

      fetchCriteria();
      handleCloseCreateModal();
    } catch (error) {
      console.error("Gagal membuat kriteria:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      Swal.fire({
        title: "Gagal!",
        text:
          "Gagal membuat kriteria. Silakan coba lagi.\n\nDetail: " +
          errorMessage,
        icon: "error",
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportReportExcel = () => {
    const filteredCriteria = criteria.filter(
      (item) =>
        item &&
        item.namaKriteria &&
        item.namaKriteria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredCriteria.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Info",
        text: "Tidak ada data kriteria untuk diexport.",
        showClass: { backdrop: "bg-black/50 backdrop-blur-sm" },
      });
      return;
    }

    const headers = [
      "Kode Kriteria",
      "Nama Kriteria",
      "Tipe Kriteria",
      "Bobot",
    ];
    const rows = filteredCriteria.map((item) => [
      item.kodeKriteria,
      item.namaKriteria,
      item.tipeKriteria,
      item.bobotKriteria,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "data_kriteria.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredCriteria = criteria.filter(
    (item) =>
      item &&
      item.namaKriteria &&
      item.namaKriteria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 text-gray-700">
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl">Tabel Kriteria</span>
        <div className="relative w-full sm:w-1/3 flex items-center">
          <input
            type="text"
            placeholder="Cari nama kriteria..."
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
        <div className="flex flex-row">
          <button
            onClick={handleOpenCreateModal}
            className="bg-green-500 hover:bg-green-700 text-white rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <FaPlus size={16} />
            Tambah
          </button>
          <button
            onClick={handleOpenReportModal}
            className="bg-blue-500 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 ml-2"
          >
            <FaFileAlt size={16} />
            Laporan
          </button>
        </div>
        <span className="">
          Total Kriteria:{" "}
          <span className="border-2 border-gray-500 p-1 rounded-sm">
            {criteria.length}
          </span>
        </span>
      </div>

      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr className="border border-gray-300 text-center">
            <th className="p-2 border-r border-gray-300">Kode Kriteria</th>
            <th className="p-2 border-r border-gray-300">Nama Kriteria</th>
            <th className="p-2 border-r border-gray-300">Tipe Kriteria</th>
            <th className="p-2 border-r border-gray-300">Bobot</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredCriteria.length > 0 ? (
            filteredCriteria.map((item) => (
              <tr key={item._id} className="border border-gray-300 text-center">
                <td className="p-2 border-r border-gray-300">
                  {item.kodeKriteria}
                </td>
                <td className="p-2 border-r border-gray-300">
                  {item.namaKriteria}
                </td>
                <td className="p-2 border-r border-gray-300">
                  {item.tipeKriteria}
                </td>
                <td className="p-2 border-r border-gray-300">
                  {item.bobotKriteria}
                </td>
                <td className="p-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-sky-500 hover:bg-sky-700 rounded p-2 flex items-center justify-center gap-1 text-white"
                  >
                    <FaPen size={15} />
                    Sunting
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 hover:bg-red-800 rounded p-2 flex items-center justify-center gap-1 text-white"
                    disabled={isDeleting === item._id}
                  >
                    {isDeleting === item._id ? (
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
                Tidak ada data kriteria
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <AnimatePresence>
        {editingCriteria && (
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
              <h2 className="text-xl font-semibold mb-4">Edit Kriteria</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Kriteria
                  </label>
                  <input
                    type="text"
                    value={kodeKriteria}
                    onChange={(e) => setKodeKriteria(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Kriteria
                  </label>
                  <input
                    type="text"
                    value={namaKriteria}
                    onChange={(e) => setNamaKriteria(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipe Kriteria
                  </label>
                  <select
                    value={tipeKriteria}
                    onChange={(e) =>
                      setTipeKriteria(e.target.value as "Benefit" | "Cost")
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Benefit">Benefit</option>
                    <option value="Cost">Cost</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bobot
                  </label>
                  <input
                    type="number"
                    value={bobotKriteria}
                    onChange={(e) => setBobotKriteria(e.target.value)}
                    min="0"
                    max="5"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setEditingCriteria(null)}
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
                Tambah Kriteria Baru
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Kriteria <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="kodeKriteria"
                    value={newCriteriaData.kodeKriteria}
                    onChange={handleCreateInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Kriteria <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaKriteria"
                    value={newCriteriaData.namaKriteria}
                    onChange={handleCreateInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipe Kriteria <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tipeKriteria"
                    value={newCriteriaData.tipeKriteria}
                    onChange={handleCreateInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Benefit">Benefit</option>
                    <option value="Cost">Cost</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bobot
                  </label>
                  <input
                    type="number"
                    name="bobotKriteria"
                    value={newCriteriaData.bobotKriteria}
                    onChange={handleCreateInputChange}
                    min="0"
                    max="5"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleCloseCreateModal}
                  className="px-4 py-2 text-white rounded bg-red-500 hover:bg-red-800"
                  disabled={isCreating}
                >
                  Batal
                </button>
                <button
                  onClick={handleCreateSave}
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

      <AnimatePresence>
        {isReportModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="report-modal-container"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto print:shadow-none print:max-w-full print:max-h-none print:overflow-visible print:p-0"
            >
              <h2 className="text-xl font-semibold mb-4 print:hidden">
                Laporan Kriteria
              </h2>

              <div
                id="criteria-report-table"
                className="print-only print:block"
              >
                <h2 className="text-xl font-semibold mb-4 text-center print-only print:block hidden">
                  Laporan Kriteria
                </h2>
                <table className="w-full border-collapse print:border-gray-500">
                  <thead className="bg-gray-100 print:bg-gray-200">
                    <tr className="border border-gray-300 text-center print:border-gray-500">
                      <th className="p-2 border-r border-gray-300 print:border-r-gray-500 print:border-b-gray-500">
                        Kode Kriteria
                      </th>
                      <th className="p-2 border-r border-gray-300 print:border-r-gray-500 print:border-b-gray-500">
                        Nama Kriteria
                      </th>
                      <th className="p-2 border-r border-gray-300 print:border-r-gray-500 print:border-b-gray-500">
                        Tipe Kriteria
                      </th>
                      <th className="p-2 print:border-b-gray-500">Bobot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCriteria.length > 0 ? (
                      filteredCriteria.map((item) => (
                        <tr
                          key={item._id}
                          className="border border-gray-300 text-center print:border-gray-500"
                        >
                          <td className="p-2 border-r border-gray-300 print:border-r-gray-500">
                            {item.kodeKriteria}
                          </td>
                          <td className="p-2 border-r border-gray-300 print:border-r-gray-500">
                            {item.namaKriteria}
                          </td>
                          <td className="p-2 border-r border-gray-300 print:border-r-gray-500">
                            {item.tipeKriteria}
                          </td>
                          <td className="p-2">{item.bobotKriteria}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border border-gray-300 text-center print:border-gray-500">
                        <td className="p-2" colSpan={4}>
                          Tidak ada data kriteria
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
