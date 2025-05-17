"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { LayoutWithHeader } from "../../components/layout-with-header";
import { Footer } from "../../components/footer";
import Link from "next/link";
import { courseService, Course } from "../../services/api";

interface UserRole {
  email: string;
  role: 'admin' | 'teacher' | 'student' | null;
}

export default function TeacherCoursesPage() {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    image: ""
  });

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
        
        // Only fetch courses if user is admin or teacher
        if (data.role === 'admin' || data.role === 'teacher') {
          fetchCourses();
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error checking user role:', err);
        setError('Failed to verify your access permissions');
        setLoading(false);
      }
    }

    checkUserRole();
  }, [user, isLoaded]);

  async function fetchCourses() {
    try {
      const coursesData = await courseService.getAllCourses();
      setCourses(coursesData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again later.');
      setLoading(false);
    }
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCourse,
          instructor: user?.fullName || user?.firstName || 'Unknown Instructor'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      // Reset form and refresh courses
      setNewCourse({
        title: "",
        description: "",
        category: "",
        level: "beginner",
        image: ""
      });
      setIsCreatingCourse(false);
      await fetchCourses();
    } catch (err) {
      console.error('Error creating course:', err);
      setError('Failed to create course. Please try again.');
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await courseService.deleteCourse(courseId);

      if (!response) {
        throw new Error('Failed to delete course');
      }

      await fetchCourses();
    } catch (err) {
      console.error('Error deleting course:', err);
      setError('Failed to delete course. Please try again.');
      setLoading(false);
    }
  };

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

  // Teacher or Admin access
  return (
    <LayoutWithHeader>
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-primary-50 border-b border-primary-100 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Управление курсами</h1>
              <button
                onClick={() => setIsCreatingCourse(!isCreatingCourse)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
              >
                {isCreatingCourse ? 'Отменить' : 'Создать курс'}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                <p>{error}</p>
                <button 
                  onClick={() => setError(null)} 
                  className="text-sm underline mt-1"
                >
                  Закрыть
                </button>
              </div>
            )}

            {/* Create Course Form */}
            {isCreatingCourse && (
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Создать новый курс</h2>
                <form onSubmit={handleCreateCourse}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="col-span-2">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">Название курса</label>
                      <input
                        type="text"
                        id="title"
                        value={newCourse.title}
                        onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Описание</label>
                      <textarea
                        id="description"
                        value={newCourse.description}
                        onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">Категория</label>
                      <input
                        type="text"
                        id="category"
                        value={newCourse.category}
                        onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="level" className="block text-sm font-medium text-gray-700">Уровень</label>
                      <select
                        id="level"
                        value={newCourse.level}
                        onChange={(e) => setNewCourse({...newCourse, level: e.target.value as "beginner" | "intermediate" | "advanced"})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value="beginner">Начальный</option>
                        <option value="intermediate">Средний</option>
                        <option value="advanced">Продвинутый</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700">URL изображения</label>
                      <input
                        type="url"
                        id="image"
                        value={newCourse.image}
                        onChange={(e) => setNewCourse({...newCourse, image: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsCreatingCourse(false)}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="bg-primary-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Создать
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Courses List */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ваши курсы</h2>
              
              {courses.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="mt-2 text-gray-500">У вас пока нет курсов</p>
                  <button
                    onClick={() => setIsCreatingCourse(true)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Создать первый курс
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <div key={course.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-40 bg-gray-200 relative">
                        {course.image && (
                          <img 
                            src={course.image} 
                            alt={course.title} 
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {course.category}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {course.level === "beginner" && "Начальный"}
                            {course.level === "intermediate" && "Средний"}
                            {course.level === "advanced" && "Продвинутый"}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span>{course.lessonsCount || 0} уроков</span>
                          </div>
                          <div className="flex space-x-2">
                            <Link 
                              href={`/teacher/courses/${course.id}`}
                              className="text-primary-600 hover:text-primary-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </Link>
                            <button 
                              onClick={() => handleDeleteCourse(course.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 border-t">
                        <Link 
                          href={`/teacher/courses/${course.id}/assignments`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                        >
                          Управление заданиями
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
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
