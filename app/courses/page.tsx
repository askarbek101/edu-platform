"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { LayoutWithHeader } from "../components/layout-with-header";
import { Footer } from "../components/footer";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { courseService, Course as ApiCourse, Assignment as ApiAssignment } from "../services/api";

// Компонент модального окна с заданиями
interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: ApiCourse | null;
  assignments: ApiAssignment[];
}

function AssignmentModal({ isOpen, onClose, course, assignments }: AssignmentModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Обработка клика вне модального окна
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !course) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-900">{course.title}: Задания</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
            <p className="text-gray-700 mb-6">{course.description}</p>
            
            <h3 className="text-xl font-semibold mb-4">Список заданий:</h3>
            
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
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">Всего заданий: {assignments.length}</span>
            <Link
              href={`/courses/${course.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Перейти к курсу
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Компонент карточки курса
interface CourseCardProps {
  course: ApiCourse;
  onClick: () => void;
}

function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gray-200 relative">
        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 bg-primary-600 text-white px-2 py-1 text-xs font-medium">
          {course.level === "beginner" && "Начальный"}
          {course.level === "intermediate" && "Средний"}
          {course.level === "advanced" && "Продвинутый"}
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {course.category}
          </span>
        </div>
        <p className="text-gray-700 mb-4 h-12 overflow-hidden">{course.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{course.lessonsCount} уроков</span>
          <div className="flex space-x-2">
            <button
              onClick={onClick}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Задания
            </button>
            <Link
              href={`/courses/${course.id}`}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Подробнее
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Фильтры для курсов
interface Filters {
  category: string;
  level: string;
  search: string;
}

export default function CoursesPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [selectedCourse, setSelectedCourse] = useState<ApiCourse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: "all",
    level: "all",
    search: "",
  });
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [assignments, setAssignments] = useState<Record<number, ApiAssignment[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get unique categories from courses
  const categories = ["all", ...Array.from(new Set(courses.map((course) => course.category)))];
  
  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesCategory = filters.category === "all" || course.category === filters.category;
    const matchesLevel = filters.level === "all" || course.level === filters.level;
    const matchesSearch = course.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                          course.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCategory && matchesLevel && matchesSearch;
  });

  // Handler for opening assignments modal
  const handleOpenAssignments = async (course: ApiCourse) => {
    setSelectedCourse(course);
    
    // Fetch assignments if we don't have them yet
    if (!assignments[course.id]) {
      try {
        await fetchAssignments(course.id);
      } catch (err) {
        console.error('Error fetching assignments:', err);
      }
    }
    
    setIsModalOpen(true);
  };

  // Обработчик закрытия модального окна
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Обработчик изменения фильтров
  const handleFilterChange = (name: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Если пользователь не авторизован, показываем сообщение о необходимости входа
  if (isLoaded && !isSignedIn) {
    return (
      <LayoutWithHeader>
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Доступ ограничен</h1>
              <p className="text-lg text-gray-700 mb-8">
                Для просмотра курсов необходимо войти в систему или зарегистрироваться.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/sign-in"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md text-center"
                >
                  Войти
                </Link>
                <Link
                  href="/sign-up"
                  className="border border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-md text-center"
                >
                  Зарегистрироваться
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </LayoutWithHeader>
    );
  }

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await courseService.getAllCourses();
        setCourses(data);
        setLoading(false);
      } catch (err) {
        setError('Error loading courses. Please try again later.');
        setLoading(false);
        console.error('Error fetching courses:', err);
      }
    }

    fetchCourses();
  }, []);

  // Fetch assignments for a course
  const fetchAssignments = async (courseId: number) => {
    // Check if we already have the assignments for this course
    if (assignments[courseId]) {
      return assignments[courseId];
    }

    try {
      const data = await courseService.getCourseAssignments(courseId);
      
      // Update assignments state
      setAssignments(prev => ({
        ...prev,
        [courseId]: data
      }));
      
      return data;
    } catch (err) {
      console.error('Error fetching assignments:', err);
      return [];
    }
  };

  return (
    <LayoutWithHeader>
      <main>
        {/* Заголовок страницы */}
        <section className="bg-primary-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Наши курсы
              </h1>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Выбирайте из широкого спектра курсов, разработанных профессионалами своего дела. Начните обучение прямо сейчас!
              </p>
            </div>
          </div>
        </section>

        {/* Фильтры и список курсов */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Фильтры */}
            <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Поиск
                  </label>
                  <input
                    type="text"
                    id="search"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Введите название курса..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Категория
                  </label>
                  <select
                    id="category"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                  >
                    <option value="all">Все категории</option>
                    {categories.filter(cat => cat !== "all").map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                    Уровень
                  </label>
                  <select
                    id="level"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={filters.level}
                    onChange={(e) => handleFilterChange("level", e.target.value)}
                  >
                    <option value="all">Все уровни</option>
                    <option value="beginner">Начальный</option>
                    <option value="intermediate">Средний</option>
                    <option value="advanced">Продвинутый</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Список курсов */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-700">Загрузка курсов...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="text-red-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Ошибка загрузки</h3>
                <p className="text-gray-700">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
                >
                  Попробовать снова
                </button>
              </div>
            )}

            {!loading && !error && filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() => handleOpenAssignments(course)}
                  />
                ))}
              </div>
            ) : !loading && !error ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Курсы не найдены</h3>
                <p className="text-gray-700">
                  Попробуйте изменить параметры фильтрации или поискать другие курсы.
                </p>
              </div>
            ) : null}
          </div>
        </section>

        {/* Модальное окно с заданиями */}
        <AssignmentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          course={selectedCourse}
          assignments={selectedCourse && assignments[selectedCourse.id] ? assignments[selectedCourse.id] : []}
        />
      </main>
      <Footer />
    </LayoutWithHeader>
  );
}
