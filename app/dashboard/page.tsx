"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutWithHeader } from "../components/layout-with-header";
import { Footer } from "../components/footer";

// Компоненты панели управления
import { StatCard } from "../components/dashboard/stat-card";
import { CourseCard } from "../components/dashboard/course-card";
import { ActivityFeed } from "../components/dashboard/activity-feed";
import { UpcomingAssignments } from "../components/dashboard/upcoming-assignments";
import { AdminStats } from "../components/dashboard/admin-stats";
import { TeacherActions } from "../components/dashboard/teacher-actions";

interface UserRole {
  email: string;
  role: 'admin' | 'teacher' | 'student' | null;
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentCourses, setRecentCourses] = useState([]);
  const [stats, setStats] = useState({
    completedLessons: 0,
    totalPoints: 0,
    activeCourses: 0,
    completionRate: 0
  });

  useEffect(() => {
    async function checkUserRole() {
      if (!user || !isLoaded) return;

      try {
        const email = user.primaryEmailAddress?.emailAddress;
        
        if (!email) {
          setError("Электронная почта пользователя не найдена");
          setLoading(false);
          return;
        }

        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error('Не удалось проверить роль пользователя');
        }

        const data = await response.json();
        setUserRole(data);
        
        // Получение данных панели управления для конкретного пользователя
        fetchDashboardData(data.role);
        
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при проверке роли пользователя:', err);
        setError('Не удалось проверить ваши права доступа');
        setLoading(false);
      }
    }

    async function fetchDashboardData(role: string) {
      // Здесь будут реальные API-вызовы
      // Демонстрационные данные
      setRecentCourses([
      ]);
      
      setStats({
        completedLessons: 24,
        totalPoints: 1250,
        activeCourses: 3,
        completionRate: 68
      });
    }

    checkUserRole();
  }, [user, isLoaded]);

  // Состояние загрузки
  if (loading || !isLoaded) {
    return (
      <LayoutWithHeader>
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-700">Загрузка вашей панели управления...</p>
            </div>
          </div>
        </main>
        <Footer />
      </LayoutWithHeader>
    );
  }

  return (
    <LayoutWithHeader>
      <main className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Раздел приветствия */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.fullName || "Пользователь"} 
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-primary-600">
                    {user?.firstName?.[0] || "П"}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  С возвращением, {user?.firstName || "Пользователь"}!
                </h1>
                <p className="text-gray-600">
                  {userRole?.role === 'admin' ? 'Администратор' : 
                   userRole?.role === 'teacher' ? 'Преподаватель' : 'Студент'}
                </p>
              </div>
              
              {/* Быстрые действия в зависимости от роли */}
              <div className="ml-auto">
                {userRole?.role === 'student' && (
                  <Link 
                    href="/courses" 
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md inline-flex items-center"
                  >
                    Просмотр курсов
                  </Link>
                )}
                {userRole?.role === 'teacher' && (
                  <Link 
                    href="/teacher/courses" 
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md inline-flex items-center"
                  >
                    Управление курсами
                  </Link>
                )}
                {userRole?.role === 'admin' && (
                  <Link 
                    href="/admin/users" 
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md inline-flex items-center"
                  >
                    Управление пользователями
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          {/* Раздел статистики */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Завершенные уроки" 
              value={stats.completedLessons} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="bg-blue-500"
            />
            <StatCard 
              title="Всего баллов" 
              value={stats.totalPoints} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="bg-green-500"
            />
            <StatCard 
              title="Активные курсы" 
              value={stats.activeCourses} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              color="bg-purple-500"
            />
            <StatCard 
              title="Процент завершения" 
              value={`${stats.completionRate}%`} 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              color="bg-orange-500"
            />
          </div>
          
          {/* Содержимое в зависимости от роли */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Основная область содержимого - меняется в зависимости от роли */}
            <div className="lg:col-span-2">
              {userRole?.role === 'admin' && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Обзор платформы</h2>
                  <AdminStats />
                </div>
              )}
              
              {userRole?.role === 'teacher' && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Действия преподавателя</h2>
                  <TeacherActions />
                </div>
              )}
              
              {/* Недавние курсы - отображаются для всех пользователей */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {userRole?.role === 'teacher' ? 'Ваши курсы' : 'Недавние курсы'}
                  </h2>
                  <Link 
                    href={userRole?.role === 'teacher' ? "/teacher/courses" : "/courses"}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Посмотреть все
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentCourses.map((course: any) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Боковая панель */}
            <div>
              {/* Предстоящие задания - для студентов и преподавателей */}
              {(userRole?.role === 'student' || userRole?.role === 'teacher') && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Предстоящие задания</h2>
                  <UpcomingAssignments />
                </div>
              )}
              
              {/* Лента последних действий - для всех пользователей */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Последние действия</h2>
                <ActivityFeed />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </LayoutWithHeader>
  );
}
