"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { LayoutWithHeader } from "../components/layout-with-header";
import { Footer } from "../components/footer";
import Link from "next/link";

interface UserRole {
  email: string;
  role: 'admin' | 'teacher' | 'student' | null;
}

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkUserRole() {
      if (!user || !isLoaded) return;

      try {
        const email = user.primaryEmailAddress?.emailAddress;
        
        if (!email) {
          setError("User email not found");
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
          throw new Error('Failed to verify user role');
        }

        const data = await response.json();
        setUserRole(data);
        setLoading(false);
      } catch (err) {
        console.error('Error checking user role:', err);
        setError('Failed to verify your access permissions');
        setLoading(false);
      }
    }

    checkUserRole();
  }, [user, isLoaded]);

  // Loading state
  if (loading || !isLoaded) {
    return (
      <LayoutWithHeader>
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-700">Проверка прав доступа...</p>
            </div>
          </div>
        </main>
        <Footer />
      </LayoutWithHeader>
    );
  }

  // Error state
  if (error) {
    return (
      <LayoutWithHeader>
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="text-red-600 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Ошибка доступа</h3>
              <p className="text-gray-700">{error}</p>
              <Link 
                href="/" 
                className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md inline-block"
              >
                Вернуться на главную
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </LayoutWithHeader>
    );
  }

  // Student access - restricted
  if (!userRole || userRole.role === 'student') {
    return (
      <LayoutWithHeader>
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="text-red-600 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Ограниченный доступ</h3>
              <p className="text-gray-700 mb-4">
                Эта зона доступна только для преподавателей и администраторов. 
                У вас нет необходимых прав доступа.
              </p>
              <Link 
                href="/courses" 
                className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md inline-block"
              >
                Перейти к курсам
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </LayoutWithHeader>
    );
  }

  // Admin access
  return (
    <LayoutWithHeader>
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-primary-50 border-b border-primary-100">
              <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Добро пожаловать, {user?.firstName}!</h2>
                  <p className="text-gray-600">Вы вошли как {userRole?.role === 'admin' ? 'администратор' : 'преподаватель'}</p>
                </div>
              </div>
              
              {/* Teacher functionality (same as teacher view) */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Функции преподавателя</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Управление курсами</h3>
                    <p className="text-gray-700 mb-4">Создавайте и редактируйте свои курсы, добавляйте уроки и задания.</p>
                    <Link 
                      href="/teacher/courses" 
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Перейти к курсам →
                    </Link>
                  </div>
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Прогресс учеников</h3>
                    <p className="text-gray-700 mb-4">Отслеживайте успеваемость учеников и их результаты.</p>
                    <div className="flex items-center">
                      <Link 
                        href="/teacher/students" 
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Просмотреть прогресс →
                      </Link>
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                        TODO
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Admin-only functionality */}
              {userRole?.role === 'admin' && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Функции администратора</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Управление пользователями</h3>
                      <p className="text-gray-700 mb-4">Добавляйте, редактируйте и управляйте пользователями системы.</p>
                      <Link 
                        href="/admin/users" 
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Управление пользователями →
                      </Link>
                    </div>
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Системные настройки</h3>
                      <p className="text-gray-700 mb-4">Настройте параметры платформы и системные опции.</p>
                      <div className="flex items-center">
                        <Link 
                          href="/admin/settings" 
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Настройки системы →
                        </Link>
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                          TODO
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Admin-only component */}
              {userRole?.role === 'admin' && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-6 relative">
                  <div className="absolute -top-3 right-4 px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded-full shadow-sm transform rotate-2">
                    BETA
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Статистика платформы</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <div className="text-sm text-gray-500 mb-1">Всего пользователей</div>
                      <div className="text-2xl font-bold text-gray-900">1,245</div>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <div className="text-sm text-gray-500 mb-1">Активных курсов</div>
                      <div className="text-2xl font-bold text-gray-900">32</div>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <div className="text-sm text-gray-500 mb-1">Завершено заданий</div>
                      <div className="text-2xl font-bold text-gray-900">8,721</div>
                    </div>
                    <div className="bg-white p-4 rounded-md shadow-sm">
                      <div className="text-sm text-gray-500 mb-1">Средняя оценка</div>
                      <div className="text-2xl font-bold text-gray-900">4.8/5</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </LayoutWithHeader>
  );
}