"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { LayoutWithHeader } from "../../../../components/layout-with-header";
import { Footer } from "../../../../components/footer";
import Link from "next/link";

// Types
interface Assignment {
  id: number;
  title: string;
  type: "test" | "input" | "drag";
  description: string;
  due_date?: string;
  points?: number;
}

interface Lesson {
  id: number;
  assignment_id: number;
  title: string;
  content?: string;
  image?: string;
  video?: string;
  right_answer?: string;
  answer_a?: string;
  answer_b?: string;
  answer_c?: string;
  answer_d?: string;
}

interface Course {
  id: number;
  title: string;
}

export default function TeacherAssignmentsPage() {
  const params = useParams();
  const courseId = parseInt(params.courseId as string);
  
  // State variables
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'assignment' | 'lesson', id: number } | null>(null);
  
  // Form states
  const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
    title: "",
    description: "",
    type: "test",
    due_date: "",
    points: 10
  });
  
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({
    title: "",
    content: "",
    image: "",
    video: "",
    answer_a: "",
    answer_b: "",
    answer_c: "",
    answer_d: "",
    right_answer: ""
  });
  
  const [isEditing, setIsEditing] = useState(false);

  // Fetch course and assignments data
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch course details
        const courseResponse = await fetch(`/api/courses/${courseId}`);
        if (!courseResponse.ok) {
          throw new Error('Failed to fetch course');
        }
        const courseData = await courseResponse.json();
        setCourse(courseData);
        
        // Fetch assignments for this course
        const assignmentsResponse = await fetch(`/api/courses/${courseId}/assignments`);
        if (!assignmentsResponse.ok) {
          throw new Error('Failed to fetch assignments');
        }
        const assignmentsData = await assignmentsResponse.json();
        setAssignments(assignmentsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load course information. Please try again later.');
        setLoading(false);
      }
    }

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  // Fetch lessons for a specific assignment
  const fetchLessons = async (assignmentId: number) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/assignments/${assignmentId}/lessons`);
      if (!response.ok) {
        throw new Error('Failed to fetch lessons');
      }
      const data = await response.json();
      setLessons(data);
      return data;
    } catch (err) {
      console.error('Error fetching lessons:', err);
      return [];
    }
  };

  // Handle opening the assignment modal
  const handleOpenAssignmentModal = (assignment?: Assignment) => {
    if (assignment) {
      // Edit existing assignment
      setNewAssignment({
        title: assignment.title,
        description: assignment.description,
        type: assignment.type,
        due_date: assignment.due_date,
        points: assignment.points
      });
      setIsEditing(true);
    } else {
      // Create new assignment
      setNewAssignment({
        title: "",
        description: "",
        type: "test",
        due_date: "",
        points: 10
      });
      setIsEditing(false);
    }
    setIsAssignmentModalOpen(true);
  };

  // Handle opening the lesson modal
  const handleOpenLessonModal = async (assignment: Assignment, lesson?: Lesson) => {
    setSelectedAssignment(assignment);
    
    if (lesson) {
      // Edit existing lesson
      setNewLesson({
        title: lesson.title,
        content: lesson.content,
        image: lesson.image,
        video: lesson.video,
        answer_a: lesson.answer_a,
        answer_b: lesson.answer_b,
        answer_c: lesson.answer_c,
        answer_d: lesson.answer_d,
        right_answer: lesson.right_answer
      });
      setIsEditing(true);
    } else {
      // Create new lesson
      setNewLesson({
        title: "",
        content: "",
        image: "",
        video: "",
        answer_a: "",
        answer_b: "",
        answer_c: "",
        answer_d: "",
        right_answer: ""
      });
      setIsEditing(false);
    }
    
    // Fetch lessons for this assignment if not already loaded
    await fetchLessons(assignment.id);
    setIsLessonModalOpen(true);
  };

  // Handle assignment form submission
  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedAssignment) {
        // Update existing assignment
        const response = await fetch(`/api/courses/${courseId}/assignments?id=${selectedAssignment.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAssignment),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update assignment');
        }
        
        const updatedAssignment = await response.json();
        
        // Update assignments list
        setAssignments(assignments.map(a => 
          a.id === selectedAssignment.id ? updatedAssignment : a
        ));
      } else {
        // Create new assignment
        const response = await fetch(`/api/courses/${courseId}/assignments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAssignment),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create assignment');
        }
        
        const createdAssignment = await response.json();
        
        // Add new assignment to list
        setAssignments([...assignments, createdAssignment]);
      }
      
      // Close modal and reset form
      setIsAssignmentModalOpen(false);
      setNewAssignment({
        title: "",
        description: "",
        type: "test",
        due_date: "",
        points: 10
      });
      setIsEditing(false);
      setSelectedAssignment(null);
    } catch (err) {
      console.error('Error saving assignment:', err);
      setError('Failed to save assignment. Please try again.');
    }
  };

  // Handle lesson form submission
  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAssignment) return;
    
    try {
      if (isEditing && newLesson.id) {
        // Update existing lesson
        const response = await fetch(`/api/courses/${courseId}/assignments/${selectedAssignment.id}/lessons?id=${newLesson.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newLesson),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update lesson');
        }
        
        const updatedLesson = await response.json();
        
        // Update lessons list
        setLessons(lessons.map(l => 
          l.id === newLesson.id ? updatedLesson : l
        ));
      } else {
        // Create new lesson
        const response = await fetch(`/api/courses/${courseId}/assignments/${selectedAssignment.id}/lessons`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newLesson),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create lesson');
        }
        
        const createdLesson = await response.json();
        
        // Add new lesson to list
        setLessons([...lessons, createdLesson]);
      }
      
      // Close modal and reset form
      setIsLessonModalOpen(false);
      setNewLesson({
        title: "",
        content: "",
        image: "",
        video: "",
        answer_a: "",
        answer_b: "",
        answer_c: "",
        answer_d: "",
        right_answer: ""
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving lesson:', err);
      setError('Failed to save lesson. Please try again.');
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      if (itemToDelete.type === 'assignment') {
        // Delete assignment
        const response = await fetch(`/api/courses/${courseId}/assignments?id=${itemToDelete.id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete assignment');
        }
        
        // Remove from assignments list
        setAssignments(assignments.filter(a => a.id !== itemToDelete.id));
      } else {
        // Delete lesson
        const response = await fetch(`/api/courses/${courseId}/assignments/${selectedAssignment?.id}/lessons?id=${itemToDelete.id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete lesson');
        }
        
        // Remove from lessons list
        setLessons(lessons.filter(l => l.id !== itemToDelete.id));
      }
      
      // Close modal
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again.');
    }
  };

  // Handle opening the delete confirmation modal
  const handleOpenDeleteModal = (type: 'assignment' | 'lesson', id: number) => {
    setItemToDelete({ type, id });
    setIsDeleteModalOpen(true);
  };

  // View lessons for an assignment
  const handleViewLessons = async (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    await fetchLessons(assignment.id);
  };

  // Loading state
  if (loading) {
    return (
      <LayoutWithHeader>
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-700">Загрузка данных...</p>
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
                href="/teacher/courses" 
                className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md inline-block"
              >
                Вернуться к курсам
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
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <Link 
              href="/teacher/courses"
              className="text-primary-600 hover:text-primary-700 flex items-center mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Вернуться к курсам
            </Link>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Управление заданиями: {course.title}</h1>
              <button
                onClick={() => handleOpenAssignmentModal()}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Добавить задание
              </button>
            </div>
          </div>

          {/* Assignments List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Задания курса</h2>
            </div>
            
            {assignments.length > 0 ? (
              <div className="divide-y">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900 mr-3">{assignment.title}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            assignment.type === "test" ? "bg-blue-100 text-blue-800" :
                            assignment.type === "input" ? "bg-green-100 text-green-800" :
                            "bg-purple-100 text-purple-800"
                          }`}>
                            {assignment.type === "test" ? "Тест" :
                             assignment.type === "input" ? "Ввод" :
                             "Перетаскивание"}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{assignment.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          {assignment.due_date && (
                            <div className="flex items-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>Срок: {new Date(assignment.due_date).toLocaleDateString()}</span>
                            </div>
                          )}
                          {assignment.points && (
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              <span>{assignment.points} баллов</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewLessons(assignment)}
                          className="text-primary-600 hover:text-primary-700 p-2"
                          title="Просмотреть уроки"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            handleOpenAssignmentModal(assignment);
                          }}
                          className="text-blue-600 hover:text-blue-700 p-2"
                          title="Редактировать задание"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal('assignment', assignment.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                          title="Удалить задание"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleOpenLessonModal(assignment)}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                          title="Добавить урок"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Lessons list (shown when assignment is selected) */}
                    {selectedAssignment?.id === assignment.id && (
                      <div className="mt-6 pl-4 border-l-4 border-primary-200">
                        <h4 className="text-md font-medium text-gray-900 mb-3">Уроки ({lessons.length})</h4>
                        {lessons.length > 0 ? (
                          <div className="space-y-3">
                            {lessons.map((lesson) => (
                              <div key={lesson.id} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                                <div>
                                  <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                                  {lesson.right_answer && (
                                    <span className="text-xs text-gray-500">Тип: Тест с вариантами ответов</span>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => {
                                      setNewLesson(lesson);
                                      handleOpenLessonModal(assignment, lesson);
                                    }}
                                    className="text-blue-600 hover:text-blue-700 p-1"
                                    title="Редактировать урок"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleOpenDeleteModal('lesson', lesson.id)}
                                    className="text-red-600 hover:text-red-700 p-1"
                                    title="Удалить урок"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">Нет уроков для этого задания. Добавьте первый урок!</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет заданий</h3>
                <p className="text-gray-600 mb-6">Для этого курса пока не добавлены задания.</p>
                <button
                  onClick={() => handleOpenAssignmentModal()}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md inline-flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Создать первое задание
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Assignment Modal */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-semibold text-gray-900">
                {isEditing ? "Редактировать задание" : "Создать новое задание"}
              </h2>
              <button
                onClick={() => setIsAssignmentModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAssignmentSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Название задания *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Описание задания
                  </label>
                  <textarea
                    id="description"
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Тип задания *
                  </label>
                  <select
                    id="type"
                    value={newAssignment.type}
                    onChange={(e) => setNewAssignment({...newAssignment, type: e.target.value as "test" | "input" | "drag"})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg sm:text-sm"
                    required
                  >
                    <option value="test">Тест</option>
                    <option value="input">Ввод</option>
                    <option value="drag">Перетаскивание</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
                    Срок выполнения
                  </label>
                  <input
                    type="datetime-local"
                    id="due_date"
                    value={newAssignment.due_date}
                    onChange={(e) => setNewAssignment({...newAssignment, due_date: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
                    Максимальный балл
                  </label>
                  <input
                    type="number"
                    id="points"
                    value={newAssignment.points}
                    onChange={(e) => setNewAssignment({...newAssignment, points: parseInt(e.target.value) || undefined})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg sm:text-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {isLessonModalOpen && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-semibold text-gray-900">
                {isEditing ? "Редактировать урок" : "Добавить новый урок"}
              </h2>
              <button
                onClick={() => setIsLessonModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleLessonSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="space-y-6">
                <div>
                  <label htmlFor="lesson-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Название урока *
                  </label>
                  <input
                    type="text"
                    id="lesson-title"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lesson-content" className="block text-sm font-medium text-gray-700 mb-1">
                    Содержание урока
                  </label>
                  <textarea
                    id="lesson-content"
                    value={newLesson.content}
                    onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="lesson-image" className="block text-sm font-medium text-gray-700 mb-1">
                    URL изображения
                  </label>
                  <input
                    type="text"
                    id="lesson-image"
                    value={newLesson.image}
                    onChange={(e) => setNewLesson({...newLesson, image: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="lesson-video" className="block text-sm font-medium text-gray-700 mb-1">
                    URL видео
                  </label>
                  <input
                    type="text"
                    id="lesson-video"
                    value={newLesson.video}
                    onChange={(e) => setNewLesson({...newLesson, video: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg sm:text-sm"
                  />
                </div>
                
                {selectedAssignment.type === "test" && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-medium text-gray-900">Варианты ответов</h3>
                    
                    <div>
                      <label htmlFor="answer-a" className="block text-sm font-medium text-gray-700 mb-1">
                        Вариант A
                      </label>
                      <input
                        type="text"
                        id="answer-a"
                        value={newLesson.answer_a}
                        onChange={(e) => setNewLesson({...newLesson, answer_a: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="answer-b" className="block text-sm font-medium text-gray-700 mb-1">
                        Вариант B
                      </label>
                      <input
                        type="text"
                        id="answer-b"
                        value={newLesson.answer_b}
                        onChange={(e) => setNewLesson({...newLesson, answer_b: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="answer-c" className="block text-sm font-medium text-gray-700 mb-1">
                        Вариант C
                      </label>
                      <input
                        type="text"
                        id="answer-c"
                        value={newLesson.answer_c}
                        onChange={(e) => setNewLesson({...newLesson, answer_c: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="answer-d" className="block text-sm font-medium text-gray-700 mb-1">
                        Вариант D
                      </label>
                      <input
                        type="text"
                        id="answer-d"
                        value={newLesson.answer_d}
                        onChange={(e) => setNewLesson({...newLesson, answer_d: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="right-answer" className="block text-sm font-medium text-gray-700 mb-1">
                        Правильный ответ *
                      </label>
                      <select
                        id="right-answer"
                        value={newLesson.right_answer}
                        onChange={(e) => setNewLesson({...newLesson, right_answer: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 focus:shadow-lg sm:text-sm"
                        required={selectedAssignment.type === "test"}
                      >
                        <option value="">Выберите правильный ответ</option>
                        <option value="A">Вариант A</option>
                        <option value="B">Вариант B</option>
                        <option value="C">Вариант C</option>
                        <option value="D">Вариант D</option>
                      </select>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsLessonModalOpen(false)}
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Подтверждение удаления</h3>
            <p className="text-gray-600 mb-6">
              Вы уверены, что хотите удалить {itemToDelete?.type === 'assignment' ? 'задание' : 'урок'}? 
              Это действие нельзя будет отменить.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmDelete}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutWithHeader>
  );
}
