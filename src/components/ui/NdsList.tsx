import React from "react";
import { Nds } from "../../types/ndsTypes";

interface NdsListProps {
  list: Nds[];
  onEdit: (item: Nds) => void;
  onSoftDeleteOrRestore: (item: Nds) => void;
  onHardDelete: (item: Nds) => void;
}

const formatDate = (date: string | null): string => {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const truncateText = (text: string, maxLength: number = 18) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

const baseBtnClass =
  "text-white px-4 py-2 rounded text-center truncate w-[150px]";

const NdsList: React.FC<NdsListProps> = ({
  list,
  onEdit,
  onSoftDeleteOrRestore,
  onHardDelete,
}) => {
  if (list.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow-sm text-gray-500">
        Нет данных для отображения.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded overflow-x-auto">
      <table
        className="min-w-[800px] w-full table-auto border-collapse"
        style={{ tableLayout: "auto" }}
      >
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-2 text-center">ID</th>
            <th className="py-3 px-2 text-center max-w-[150px] sm:max-w-[200px] md:max-w-[250px]">
              Наименование
            </th>
            <th className="py-3 px-2 text-center hidden sm:table-cell">
              Описание
            </th>
            <th className="py-3 px-2 text-center whitespace-nowrap">
              Ставка (%)
            </th>
            <th className="py-3 px-2 text-center" style={{ width: "200px" }}>
              Удалён
            </th>
            <th className="py-3 px-2 text-center">Действия</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {list.map((ndsItem) => {
            const isDeleted = Boolean(ndsItem.deletedAt);
            return (
              <tr
                key={ndsItem.id}
                className={`hover:bg-gray-50 ${
                  isDeleted ? "bg-red-50" : "bg-white"
                }`}
              >
                <td
                  className="py-3 px-2 text-center truncate"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={ndsItem.id || undefined}
                >
                  {truncateText(ndsItem.id, 8)}
                </td>
                <td
                  className="py-3 px-2 text-left break-words max-w-[150px] sm:max-w-[200px] md:max-w-[250px]"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                  title={ndsItem.name || undefined}
                >
                  {ndsItem.name}
                </td>
                <td
                  className="py-3 px-2 text-left break-words hidden sm:table-cell"
                  style={{
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {ndsItem.description || "—"}
                </td>
                <td className="py-3 px-2 text-center">{ndsItem.value}%</td>
                <td
                  className="py-3 px-2 text-center truncate"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={
                    ndsItem.deletedAt ? formatDate(ndsItem.deletedAt) : undefined
                  }
                >
                  {ndsItem.deletedAt
                    ? truncateText(formatDate(ndsItem.deletedAt), 20)
                    : "—"}
                </td>
                <td className="py-3 px-2 text-center">
                  <div className="flex justify-center gap-2 flex-wrap">
                    {!isDeleted && (
                      <button
                        onClick={() => onEdit(ndsItem)}
                        className={`${baseBtnClass} bg-blue-500 hover:bg-blue-600`}
                      >
                        Редактировать
                      </button>
                    )}
                    <button
                      onClick={() => onSoftDeleteOrRestore(ndsItem)}
                      className={`${baseBtnClass} bg-yellow-500 hover:bg-yellow-600`}
                    >
                      {isDeleted ? "Восстановить" : "Удалить"}
                    </button>
                    {isDeleted && (
                      <button
                        onClick={() => onHardDelete(ndsItem)}
                        className={`${baseBtnClass} bg-red-500 hover:bg-red-600`}
                      >
                        Удалить навсегда
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default NdsList;
