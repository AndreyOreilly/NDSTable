import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import NdsPage from './components/pages/NdsPage';

function App() {
  const { token, fetchToken, removeToken, setCustomToken } = useAuth();
  const [customToken, setCustomTokenInput] = useState('');

  const handleCustomToken = () => {
    setCustomToken(customToken);
    setCustomTokenInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-6xl p-4">
        <div className="bg-white shadow rounded p-3 w-full">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full">
            {!token ? (
              <>
                <input
                  type="text"
                  value={customToken}
                  onChange={(e) => setCustomTokenInput(e.target.value)}
                  placeholder="Вставьте свой токен"
                  className="border border-gray-300 rounded px-3 py-2 flex-grow"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={fetchToken}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded truncate"
                    style={{ minWidth: '150px', maxWidth: '200px' }}
                  >
                    Получить токен
                  </button>
                  <button
                    onClick={handleCustomToken}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded truncate"
                    style={{ minWidth: '150px', maxWidth: '200px' }}
                  >
                    Установить
                  </button>
                </div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="JWT Token"
                  value={token || ''}
                  readOnly
                  className="border border-gray-300 rounded px-3 py-2 flex-grow"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={removeToken}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded truncate"
                    style={{ minWidth: '150px', maxWidth: '200px' }}
                  >
                    Удалить токен
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded p-4 overflow-x-auto w-full mt-4">
          {token ? (
            <NdsPage />
          ) : (
            <p className="text-red-500">
              Для отображения данных необходимо авторизоваться (получить токен).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
