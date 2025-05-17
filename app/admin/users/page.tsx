"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { LayoutWithHeader } from "../../components/layout-with-header";
import { Footer } from "../../components/footer";
import Link from "next/link";

interface User {
  id: number;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  created_at?: string;
}

interface UserRole {
  email: string;
  role: 'admin' | 'teacher' | 'student' | null;
}

export default function AdminUsersPage() {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'teachers' | 'students'>('teachers');
  const [updateStatus, setUpdateStatus] = useState<{
    userId: number | null;
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ userId: null, status: 'idle', message: '' });

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
        
        // If user is admin, fetch the users
        if (data.role === 'admin') {
          await fetchUsers();
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error checking user role:', err);
        setError('Failed to verify your access permissions');
        setLoading(false);
      }
    }

    checkUserRole();
  }, [user, isLoaded]);

  async function fetchUsers() {
    try {
      // Fetch teachers
      const teachersResponse = await fetch('/api/users?role=teacher');
      if (!teachersResponse.ok) {
        throw new Error('Failed to fetch teachers');
      }
      const teachersData = await teachersResponse.json();
      setTeachers(teachersData.users);

      // Fetch students
      const studentsResponse = await fetch('/api/users?role=student');
      if (!studentsResponse.ok) {
        throw new Error('Failed to fetch students');
      }
      const studentsData = await studentsResponse.json();
      setStudents(studentsData.users);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    }
  }

  async function handleRoleChange(userId: number, currentRole: 'teacher' | 'student') {
    // Set the new role to the opposite of the current role
    const newRole = currentRole === 'teacher' ? 'student' : 'teacher';
    
    setUpdateStatus({
      userId,
      status: 'loading',
      message: `Changing role to ${newRole}...`
    });

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          role: newRole
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      setUpdateStatus({
        userId,
        status: 'success',
        message: `Successfully changed to ${newRole}`
      });

      // Refresh the user lists
      await fetchUsers();
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setUpdateStatus({ userId: null, status: 'idle', message: '' });
      }, 3000);
    } catch (err) {
      console.error('Error updating user role:', err);
      setUpdateStatus({
        userId,
        status: 'error',
        message: 'Failed to update role'
      });
      
      // Reset error status after 3 seconds
      setTimeout(() => {
        setUpdateStatus({ userId: null, status: 'idle', message: '' });
      }, 3000);
    }
  }

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
                href="/admin" 
                className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md inline-block"
              >
                Вернуться в панель администратора
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </LayoutWithHeader>
    );
  }

  // Non-admin access - restricted
  if (!userRole || userRole.role !== 'admin') {
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
                Эта зона доступна только для администраторов. 
                У вас нет необходимых прав доступа.
              </p>
              <Link 
                href={userRole?.role === 'student' ? "/courses" : "/admin"} 
                className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md inline-block"
              >
                {userRole?.role === 'student' ? 'Вернуться к курсам' : 'Вернуться в панель администратора'}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </LayoutWithHeader>
    );
  }

  // Admin access - show user management interface
  return (
    <LayoutWithHeader>
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-primary-50 border-b border-primary-100">
              <h1 className="text-2xl font-bold text-gray-900">Управление пользователями</h1>
            </div>
            
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('teachers')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'teachers'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Преподаватели ({teachers.length})
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'students'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Студенты ({students.length})
                </button>
              </nav>
            </div>
            
            {/* User list */}
            <div className="p-6">
              {activeTab === 'teachers' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Список преподавателей</h2>
                  {teachers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Роль
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Действия
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {teachers.map((teacher) => (
                            <tr key={teacher.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {teacher.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Преподаватель
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {updateStatus.userId === teacher.id ? (
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    updateStatus.status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
                                    updateStatus.status === 'success' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {updateStatus.message}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleRoleChange(teacher.id, 'teacher')}
                                    className="text-primary-600 hover:text-primary-900"
                                  >
                                    Сделать студентом
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">Преподаватели не найдены.</p>
                  )}
                </div>
              )}
              
              {activeTab === 'students' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Список студентов</h2>
                  {students.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Роль
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Действия
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {students.map((student) => (
                            <tr key={student.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {student.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Студент
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {updateStatus.userId === student.id ? (
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    updateStatus.status === 'loading' ? 'bg-yellow-100 text-yellow-800' :
                                    updateStatus.status === 'success' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {updateStatus.message}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleRoleChange(student.id, 'student')}
                                    className="text-primary-600 hover:text-primary-900"
                                  >
                                    Сделать преподавателем
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">Студенты не найдены.</p>
                  )}
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
