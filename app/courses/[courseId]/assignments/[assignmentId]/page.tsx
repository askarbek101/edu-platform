"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { LayoutWithHeader } from "../../../../components/layout-with-header";
import { Footer } from "../../../../components/footer";
import Link from "next/link";

// Types
interface Lesson {
  id: number;
  assignment_id: number;
  title: string;
  content?: string;
  image?: string;
  video?: string;
  answer_type: "single" | "multiple" | "matching";
  answers: string;
  right_answer: string;
  created_at?: Date;
}

interface Assignment {
  id: number;
  title: string;
  type: "test" | "input" | "drag";
  description: string;
}

export default function AssignmentPage() {
  const params = useParams();
  const courseId = parseInt(params.courseId as string);
  const assignmentId = parseInt(params.assignmentId as string);
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // For single choice questions
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // For multiple choice questions
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  // For matching questions
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});
  
  const [answerChecked, setAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch assignment details
        const assignmentResponse = await fetch(`/api/courses/${courseId}/assignments/${assignmentId}`);
        if (!assignmentResponse.ok) {
          throw new Error('Failed to fetch assignment');
        }
        const assignmentData = await assignmentResponse.json();
        setAssignment(assignmentData);
        
        // Fetch lessons for this assignment
        const lessonsResponse = await fetch(`/api/courses/${courseId}/assignments/${assignmentId}/lessons`);
        if (!lessonsResponse.ok) {
          throw new Error('Failed to fetch lessons');
        }
        const lessonsData = await lessonsResponse.json();
        setLessons(lessonsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load assignment information. Please try again later.');
        setLoading(false);
      }
    }

    if (courseId && assignmentId) {
      fetchData();
    }
  }, [courseId, assignmentId]);

  // Reset quiz state when moving to a new lesson
  useEffect(() => {
    setSelectedOption(null);
    setSelectedOptions([]);
    setMatchingAnswers({});
    setAnswerChecked(false);
    setIsCorrect(false);
  }, [currentLessonIndex]);

  // Handle option selection for single choice questions
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    // Reset answer check when a new option is selected
    if (answerChecked) {
      setAnswerChecked(false);
      setIsCorrect(false);
    }
  };

  // Handle option selection for multiple choice questions
  const handleMultipleOptionSelect = (option: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option);
      } else {
        return [...prev, option];
      }
    });
    
    // Reset answer check when options change
    if (answerChecked) {
      setAnswerChecked(false);
      setIsCorrect(false);
    }
  };

  // Handle drag and drop for matching questions
  const handleMatchingDrop = (questionId: string, answerId: string) => {
    // Check if this answer is already assigned to another question
    const existingQuestionId = Object.keys(matchingAnswers).find(
      qId => matchingAnswers[qId] === answerId
    );
    
    // If it's assigned elsewhere, remove that assignment
    if (existingQuestionId) {
      setMatchingAnswers(prev => {
        const updated = {...prev};
        delete updated[existingQuestionId];
        return updated;
      });
    }
    
    // Assign to the new question
    setMatchingAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
    
    // Reset answer check when matches change
    if (answerChecked) {
      setAnswerChecked(false);
      setIsCorrect(false);
    }
  };

  // Handle removing an answer from a question
  const handleRemoveMatch = (questionId: string) => {
    setMatchingAnswers(prev => {
      const updated = {...prev};
      delete updated[questionId];
      return updated;
    });
    
    // Reset answer check when matches change
    if (answerChecked) {
      setAnswerChecked(false);
      setIsCorrect(false);
    }
  };

  // Check if the selected answer is correct
  const checkAnswer = () => {
    const currentLesson = lessons[currentLessonIndex];
    setAnswerChecked(true);
    
    if (currentLesson.answer_type === "single") {
      setIsCorrect(selectedOption === currentLesson.right_answer);
    } 
    else if (currentLesson.answer_type === "multiple") {
      const correctAnswers = JSON.parse(currentLesson.right_answer) as string[];
      const isAllCorrect = correctAnswers.length === selectedOptions.length && 
        correctAnswers.every(option => selectedOptions.includes(option));
      setIsCorrect(isAllCorrect);
    } 
    else if (currentLesson.answer_type === "matching") {
      const correctMatches = JSON.parse(currentLesson.right_answer) as Record<string, string>;
      const isAllMatched = Object.keys(correctMatches).every(
        questionId => matchingAnswers[questionId] === correctMatches[questionId]
      );
      setIsCorrect(isAllMatched);
    }
  };

  // Navigate to next lesson
  const nextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  // Navigate to previous lesson
  const prevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  // Loading state
  if (loading) {
    return (
      <LayoutWithHeader>
        <main className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-700">Загрузка задания...</p>
            </div>
          </div>
        </main>
        <Footer />
      </LayoutWithHeader>
    );
  }

  // Error state
  if (error || !assignment) {
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
              <p className="text-gray-700">{error || "Задание не найдено"}</p>
              <Link 
                href={`/courses/${courseId}`} 
                className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md inline-block"
              >
                Вернуться к курсу
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </LayoutWithHeader>
    );
  }

  // Get current lesson
  const currentLesson = lessons[currentLessonIndex];

  // Render quiz based on lesson type
  const renderQuiz = () => {
    if (!currentLesson) return null;
    
    try {
      const parsedAnswers = JSON.parse(currentLesson.answers);
      
      if (currentLesson.answer_type === "single") {
        return (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Проверьте свои знания</h3>
            <div className="space-y-4">
              {Object.entries(parsedAnswers).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    id={`option-${key}`} 
                    name="quiz-option" 
                    className="h-4 w-4 text-primary-600" 
                    checked={selectedOption === key}
                    onChange={() => handleOptionSelect(key)}
                  />
                  <label htmlFor={`option-${key}`} className="text-gray-700">{value as string}</label>
                </div>
              ))}
              
              {answerChecked && (
                <div className={`mt-4 p-3 rounded-md ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isCorrect 
                    ? 'Правильно! Отличная работа.' 
                    : 'Неправильно. Попробуйте еще раз.'}
                </div>
              )}
              
              <button 
                className={`mt-4 px-4 py-2 rounded-md ${
                  !selectedOption 
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
                onClick={checkAnswer}
                disabled={!selectedOption}
              >
                Проверить ответ
              </button>
            </div>
          </div>
        );
      } 
      else if (currentLesson.answer_type === "multiple") {
        return (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Выберите все правильные ответы</h3>
            <div className="space-y-4">
              {Object.entries(parsedAnswers).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    id={`option-${key}`} 
                    className="h-4 w-4 text-primary-600 rounded" 
                    checked={selectedOptions.includes(key)}
                    onChange={() => handleMultipleOptionSelect(key)}
                  />
                  <label htmlFor={`option-${key}`} className="text-gray-700">{value as string}</label>
                </div>
              ))}
              
              {answerChecked && (
                <div className={`mt-4 p-3 rounded-md ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isCorrect 
                    ? 'Правильно! Отличная работа.' 
                    : 'Неправильно. Попробуйте еще раз.'}
                </div>
              )}
              
              <button 
                className={`mt-4 px-4 py-2 rounded-md ${
                  selectedOptions.length === 0
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
                onClick={checkAnswer}
                disabled={selectedOptions.length === 0}
              >
                Проверить ответ
              </button>
            </div>
          </div>
        );
      } 
      else if (currentLesson.answer_type === "matching") {
        // Separate questions and answers
        const questions: Record<string, string> = {};
        const answers: Record<string, string> = {};
        
        Object.entries(parsedAnswers).forEach(([key, value]) => {
          // Numeric keys are questions, alphabetic keys are answers
          if (/^\d+$/.test(key)) {
            questions[key] = value as string;
          } else {
            answers[key] = value as string;
          }
        });
        
        // Get list of answers that are not currently matched
        const usedAnswerIds = Object.values(matchingAnswers);
        const availableAnswers = Object.entries(answers).filter(
          ([answerId]) => !usedAnswerIds.includes(answerId)
        );
        
        return (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Сопоставьте элементы</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Questions column with drop zones */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Вопросы</h4>
                {Object.entries(questions).map(([questionId, questionText]) => (
                  <div 
                    key={questionId}
                    className="p-3 bg-white border border-gray-300 rounded-md flex justify-between items-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const answerId = e.dataTransfer.getData("answerId");
                      handleMatchingDrop(questionId, answerId);
                    }}
                  >
                    <span className="font-medium">{questionText}</span>
                    {matchingAnswers[questionId] ? (
                      <div 
                        className="ml-4 p-2 bg-primary-50 border border-primary-200 rounded-md min-w-[150px] text-center cursor-move flex items-center justify-between"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("answerId", matchingAnswers[questionId]);
                        }}
                      >
                        <span>{answers[matchingAnswers[questionId]]}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveMatch(questionId);
                          }}
                          className="ml-2 w-5 h-5 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600"
                          title="Удалить"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="ml-4 p-2 bg-gray-100 border border-dashed border-gray-400 rounded-md min-w-[150px] text-center text-gray-500">
                        Перетащите ответ сюда
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Answers column */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Ответы</h4>
                <div className="grid grid-cols-1 gap-2">
                  {availableAnswers.map(([answerId, answerText]) => (
                    <div
                      key={answerId}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("answerId", answerId);
                      }}
                      className="p-3 bg-primary-50 border border-primary-200 rounded-md cursor-move hover:bg-primary-100"
                    >
                      {answerText}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {answerChecked && (
              <div className={`mt-4 p-3 rounded-md ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isCorrect 
                  ? 'Правильно! Отличная работа.' 
                  : 'Неправильно. Попробуйте еще раз.'}
              </div>
            )}
            
            <button 
              className={`mt-4 px-4 py-2 rounded-md ${
                Object.keys(matchingAnswers).length < Object.keys(questions).length
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
              onClick={checkAnswer}
              disabled={Object.keys(matchingAnswers).length < Object.keys(questions).length}
            >
              Проверить ответ
            </button>
          </div>
        );
      }
    } catch (err) {
      console.error("Error parsing answers:", err);
      return (
        <div className="mt-8 p-6 bg-red-50 rounded-lg">
          <p className="text-red-600">Ошибка при загрузке вопроса. Пожалуйста, сообщите администратору.</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <LayoutWithHeader>
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Assignment Header */}
          <div className="mb-8">
            <Link 
              href={`/courses/${courseId}`}
              className="text-primary-600 hover:text-primary-700 flex items-center mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Вернуться к курсу
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
            <p className="text-gray-700">{assignment.description}</p>
            
            <div className="mt-4 flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2">
                {assignment.type === "test" && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Тест
                  </span>
                )}
                {assignment.type === "input" && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Ввод
                  </span>
                )}
                {assignment.type === "drag" && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    Перетаскивание
                  </span>
                )}
              </span>
              <span className="text-sm text-gray-600">
                {lessons.length} {lessons.length === 1 ? 'урок' : lessons.length >= 2 && lessons.length <= 4 ? 'урока' : 'уроков'}
              </span>
            </div>
          </div>

          {/* Lesson Content */}
          {lessons.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Lesson Navigation */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Урок {currentLessonIndex + 1} из {lessons.length}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={prevLesson}
                    disabled={currentLessonIndex === 0}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentLessonIndex === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Предыдущий
                  </button>
                  <button
                    onClick={nextLesson}
                    disabled={currentLessonIndex === lessons.length - 1}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentLessonIndex === lessons.length - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    Следующий
                  </button>
                </div>
              </div>

              {/* Lesson Title */}
              <div className="px-6 py-4 border-b">
                <h2 className="text-2xl font-bold text-gray-900">{currentLesson.title}</h2>
              </div>

              {/* Lesson Content */}
              <div className="px-6 py-8">
                {currentLesson.content && (
                  <div className="prose max-w-none mb-8">
                    <p>{currentLesson.content}</p>
                  </div>
                )}

                {currentLesson.image && (
                  <div className="mb-8">
                    <img 
                      src={currentLesson.image} 
                      alt={currentLesson.title} 
                      className="w-full max-w-2xl mx-auto rounded-lg"
                    />
                  </div>
                )}

                {currentLesson.video && (
                  <div className="mb-8 aspect-w-16 aspect-h-9">
                    <iframe
                      src={currentLesson.video}
                      title={currentLesson.title}
                      className="w-full h-96 rounded-lg"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                {/* Quiz/Test Section based on lesson type */}
                {renderQuiz()}
              </div>

              {/* Lesson Navigation (Bottom) */}
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
                <button
                  onClick={prevLesson}
                  disabled={currentLessonIndex === 0}
                  className={`px-4 py-2 rounded-md ${
                    currentLessonIndex === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ← Предыдущий урок
                </button>
                <button
                  onClick={nextLesson}
                  disabled={currentLessonIndex === lessons.length - 1}
                  className={`px-4 py-2 rounded-md ${
                    currentLessonIndex === lessons.length - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  Следующий урок →
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="text-gray-600 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Нет уроков</h3>
              <p className="text-gray-700">К этому заданию пока не добавлены уроки.</p>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="mt-8">
            <div className="bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary-600 h-2.5 rounded-full" 
                style={{ width: `${((currentLessonIndex + 1) / lessons.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Прогресс: {Math.round(((currentLessonIndex + 1) / lessons.length) * 100)}%</span>
              <span>{currentLessonIndex + 1} из {lessons.length} уроков</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </LayoutWithHeader>
  );
}
