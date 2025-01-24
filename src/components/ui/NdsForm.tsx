import React, { useState, useEffect } from 'react';
import { Nds } from '../../types/ndsTypes';

interface NdsFormProps {
  initialData?: Nds;
  onSubmit: (formData: Omit<Nds, 'id'>) => void;
  onCancel: () => void;
}

const NdsForm: React.FC<NdsFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [valueStr, setValueStr] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setValueStr(String(initialData.value));
    } else {
      setName('');
      setDescription('');
      setValueStr('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedVal = parseFloat(valueStr);

    if (isNaN(parsedVal) || parsedVal < 0) {
      setError('Введите корректное числовое значение для поля "Ставка (%)".');
      return;
    }

    onSubmit({
      name,
      description,
      value: parsedVal,
      deletedAt: initialData?.deletedAt || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border p-4 rounded shadow-md max-w-md">
      <div className="mb-3">
        <label className="block mb-1 font-semibold">Наименование:</label>
        <input
          type="text"
          className="border w-full px-2 py-1 rounded"
          placeholder="Введите наименование"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Описание:</label>
        <textarea
          className="border w-full px-2 py-1 rounded"
          placeholder="Введите описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Ставка (%):</label>
        <input
          type="text"
          className="border w-full px-2 py-1 rounded"
          placeholder="Введите числовое значение"
          value={valueStr}
          onChange={(e) => {
            setValueStr(e.target.value);
            setError(null);
          }}
          required
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Сохранить
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
        >
          Отмена
        </button>
      </div>
    </form>
  );
};

export default NdsForm;
