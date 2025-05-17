"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { LayoutWithHeader } from "../../components/layout-with-header";
import { Footer } from "../../components/footer";
import Link from "next/link";
import { courseService, Course as ApiCourse, Assignment as ApiAssignment } from "../../services/api";

export default function CoursePage() {
  const params = useParams();
  const courseId = parseInt(params.courseId as string);
  
  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [assignments, setAssignments] = useState<ApiAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        // Fetch course details
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);
        
        // Fetch course assignments
        const assignmentsData = await courseService.getCourseAssignments(courseId);
        setAssignments(assignmentsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course information. Please try again later.');
        setLoading(false);
      }
    }

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  // Loading state
  if (loading) {
    return (
      <LayoutWithHeader>
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-700">Загрузка курса...</p>
            </div>
          </div>
        </main>
        <Footer />
      </LayoutWithHeader>
    );
  }

  // Error state
  if (error || !course) {
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
              <h3 className="text-xl font-medium text-gray-900 mb-2">Ошибка загрузки</h3>
              <p className="text-gray-700">{error || "Курс не найден"}</p>
              <Link 
                href="/courses" 
                className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md inline-block"
              >
                Вернуться к списку курсов
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </LayoutWithHeader>
    );
  }

  return (
    <LayoutWithHeader>
      <main>
        {/* Course Header */}
        <section className="bg-primary-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <div className="flex items-center mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                    {course.category}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {course.level === "beginner" && "Начальный"}
                    {course.level === "intermediate" && "Средний"}
                    {course.level === "advanced" && "Продвинутый"}
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
                <p className="text-lg text-gray-700 mb-6">{course.description}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>{course.lessonsCount} уроков</span>
                </div>
              </div>
              <div className="md:w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {course.image && (
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-6">
                  <Link 
                    href={assignments.length > 0 ? `/courses/${course.id}/assignments/${assignments[0].id}` : '#'}
                    className={`w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md mb-4 inline-block text-center ${assignments.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {assignments.length > 0 ? 'Начать обучение' : 'Нет доступных заданий'}
                  </Link>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Уровень:</span>
                    <span className="font-medium">
                      {course.level === "beginner" && "Начальный"}
                      {course.level === "intermediate" && "Средний"}
                      {course.level === "advanced" && "Продвинутый"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Категория:</span>
                    <span className="font-medium">{course.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">О курсе</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{course.description}</p>
                  {/* Additional course content would go here */}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Задания курса</h2>
                {assignments.length > 0 ? (
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            {assignment.type === "test" && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Тест
                              </span>
                            )}
                            {assignment.type === "input" && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Ввод
                              </span>
                            )}
                            {assignment.type === "drag" && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Перетаскивание
                              </span>
                            )}
                          </div>
                          <div className="ml-3 flex-1">
                            <h4 className="text-lg font-medium text-gray-900">{assignment.title}</h4>
                            <p className="mt-1 text-sm text-gray-600">{assignment.description}</p>
                          </div>
                          <div className="ml-4">
                            <Link
                              href={`/courses/${course.id}/assignments/${assignment.id}`}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              Начать
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700">Для этого курса пока нет заданий.</p>
                )}
              </div>

              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Содержание курса</h3>
                  <div className="space-y-3">
                    {Array.from({ length: course.lessonsCount || 0 }).map((_, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-medium mr-3">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">Урок {index + 1}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Поделиться курсом:</h4>
                    <div className="flex space-x-2">
                      <button className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </button>
                      <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                      </button>
                      <button className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </LayoutWithHeader>
  );
} 