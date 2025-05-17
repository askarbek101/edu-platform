export function ActivityFeed() {
  // Демонстрационные данные для ленты активности
  const activities = [
    { 
      id: 1, 
      type: 'completion', 
      title: 'Завершено "Введение в переменные"', 
      time: '2 часа назад',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: 2, 
      type: 'assignment', 
      title: 'Отправлен "Тест по основам JavaScript"', 
      time: 'Вчера',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    { 
      id: 3, 
      type: 'enrollment', 
      title: 'Записан на курс "Основы веб-разработки"', 
      time: '3 дня назад',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      id: 4, 
      type: 'achievement', 
      title: 'Получен значок "Быстрый ученик"', 
      time: '1 неделю назад',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
  ];

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start">
          <div className="mr-3 mt-1">
            {activity.icon}
          </div>
          <div>
            <p className="text-gray-900">{activity.title}</p>
            <p className="text-sm text-gray-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 