export function AdminStats() {
  // Демонстрационные данные для статистики администратора
  const stats = {
    totalUsers: 1245,
    activeCourses: 32,
    completedAssignments: 8721,
    averageRating: 4.8
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-sm text-gray-500 mb-1">Всего пользователей</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-sm text-gray-500 mb-1">Активных курсов</div>
          <div className="text-2xl font-bold text-gray-900">{stats.activeCourses}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-sm text-gray-500 mb-1">Выполненных заданий</div>
          <div className="text-2xl font-bold text-gray-900">{stats.completedAssignments}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="text-sm text-gray-500 mb-1">Средняя оценка</div>
          <div className="text-2xl font-bold text-gray-900">{stats.averageRating}/5</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-900">Недавние регистрации</h3>
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          Все пользователи
        </button>
      </div>
      
      <div className="bg-gray-50 rounded-md p-4">
        <p className="text-gray-500 text-center">Здесь будет график регистраций пользователей</p>
        <div className="h-40 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
      </div>
    </div>
  );
} 