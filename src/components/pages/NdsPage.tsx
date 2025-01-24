import React, { useEffect, useState } from "react";
import {
  getAllNds,
  createNdsItem,
  updateNdsItem,
  deleteNdsItem,
} from "../../api/ndsService";
import { Nds } from "../../types/ndsTypes";
import NdsModal from "../ui/ndsModal";
import NdsList from "../ui/NdsList";
import NdsForm from "../ui/NdsForm";
import { v4 as uuidv4 } from "uuid";
import { AxiosError } from "axios";

type FilterType = "all" | "active" | "deleted";

const getErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message || "Произошла ошибка.";
};

const NdsPage: React.FC = () => {
  const [ndsList, setNdsList] = useState<Nds[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Nds | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  const fetchNds = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getAllNds();
      setNdsList(data);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNds();
  }, []);

  const filteredList = ndsList.filter((item) => {
    if (filter === "active") {
      return !item.deletedAt;
    } else if (filter === "deleted") {
      return !!item.deletedAt;
    }
    return true;
  });

  const handleCreateNew = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleSubmitCreate = async (formData: Omit<Nds, "id">) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const newId = uuidv4();
      const newItem = await createNdsItem({
        ...formData,
        id: newId,
        deletedAt: null,
      });
      setNdsList((prev) => [newItem, ...prev]);
      setShowForm(false);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Nds) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleSubmitEdit = async (formData: Omit<Nds, "id">) => {
    if (!selectedItem) return;
    setErrorMsg(null);
    setLoading(true);
    try {
      const updateData = {
        ...formData,
        deletedAt: selectedItem.deletedAt,
      };
      await updateNdsItem(selectedItem.id, updateData);
      setNdsList((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, ...updateData } : item
        )
      );
      setShowForm(false);
      setSelectedItem(null);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDeleteOrRestore = async (item: Nds) => {
    setErrorMsg(null);
    setLoading(true);

    const isDeleted = !!item.deletedAt;
    const newDeletedAt = isDeleted ? null : new Date().toISOString();

    try {
      const updatedItem = { ...item, deletedAt: newDeletedAt };
      await updateNdsItem(item.id, updatedItem);
      setNdsList((prev) =>
        prev.map((el) =>
          el.id === item.id ? { ...el, deletedAt: updatedItem.deletedAt } : el
        )
      );
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleHardDelete = async (item: Nds) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await deleteNdsItem(item.id);
      setNdsList((prev) => prev.filter((el) => el.id !== item.id));
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Справочник НДС</h1>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={fetchNds}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded min-w-[120px] disabled:bg-gray-400"
        >
          {loading ? "Загрузка..." : "Обновить"}
        </button>

        <button
          onClick={handleCreateNew}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded min-w-[120px]"
        >
          Создать
        </button>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className="border px-4 py-2 rounded min-w-[120px]"
        >
          <option value="all">Все</option>
          <option value="active">Активные</option>
          <option value="deleted">Удалённые</option>
        </select>
      </div>

      {errorMsg && (
        <div className="text-red-700 mb-4 border border-red-300 bg-red-100 p-3 rounded">
          {errorMsg}
        </div>
      )}

      <NdsList
        list={filteredList}
        onEdit={handleEdit}
        onSoftDeleteOrRestore={handleSoftDeleteOrRestore}
        onHardDelete={handleHardDelete}
      />

      <NdsModal isOpen={showForm} onClose={handleCancelForm}>
        <h2 className="font-semibold mb-2 text-lg">
          {selectedItem
            ? "Редактирование элемента"
            : "Создание нового элемента"}
        </h2>
        <NdsForm
          initialData={selectedItem || undefined}
          onSubmit={selectedItem ? handleSubmitEdit : handleSubmitCreate}
          onCancel={handleCancelForm}
        />
      </NdsModal>
    </div>
  );
};

export default NdsPage;
