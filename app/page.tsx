import { SignedIn, SignedOut } from "@clerk/nextjs"
import { LearnMore } from "./components/learn-more"
import screenshotDevices from "./images/user-button@2xrl.webp"
import signIn from "./images/sign-in@2xrl.webp"
import verify from "./images/verify@2xrl.webp"
import userButton2 from "./images/user-button-2@2xrl.webp"
import signUp from "./images/sign-up@2xrl.webp"
import logo from "./images/logo.png"
import "./home.css"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "./components/footer"
import { LayoutWithHeader } from "./components/layout-with-header"

import { CARDS } from "./consts/cards"
import { ClerkLogo } from "./components/clerk-logo"
import { NextLogo } from "./components/next-logo"
import { CourseList } from "./components/course-list"

export default function Home() {
  return (
    <LayoutWithHeader>
      <main>
        {/* Герой-секция */}
        <section className="bg-primary-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Онлайн-обучение для всех
                </h1>
                <p className="text-lg text-gray-700 mb-8">
                  Проходите курсы, выполняйте задания и развивайте свои навыки в удобном для вас темпе.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/courses" 
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md text-center"
                  >
                    Начать обучение
                  </Link>
                  <Link 
                    href="/about" 
                    className="border border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-md text-center"
                  >
                    Узнать больше
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="relative h-80 w-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-400 rounded-lg opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-primary-600 mb-2">
                        <span className="gradient">Учись</span>
                      </div>
                      <div className="text-6xl font-bold text-primary-600 mb-2">
                        <span className="gradient">Практикуйся</span>
                      </div>
                      <div className="text-6xl font-bold text-primary-600">
                        <span className="gradient">Развивайся</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Секция для учеников */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Для учеников
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Разнообразные курсы
                </h3>
                <p className="text-gray-700">
                  Выбирайте из широкого спектра курсов, разработанных профессионалами своего дела.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Видео и текстовые уроки
                </h3>
                <p className="text-gray-700">
                  Изучайте материал в удобном для вас формате: видеоуроки или текстовые лекции.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Интерактивные задания
                </h3>
                <p className="text-gray-700">
                  Закрепляйте знания с помощью тестов, практических заданий и интерактивных упражнений.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Секция для преподавателей */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Для преподавателей
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Создавайте курсы
                </h3>
                <p className="text-gray-700">
                  Легко добавляйте новые курсы, уроки и задания с помощью удобного интерфейса.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Отслеживайте прогресс
                </h3>
                <p className="text-gray-700">
                  Анализируйте результаты учеников, отслеживайте их прогресс и предоставляйте обратную связь.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Секция с популярными курсами */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Популярные курсы
            </h2>
            <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto">
              Начните обучение прямо сейчас с наших самых популярных курсов
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <CourseList />
            </div>
            <div className="mt-12 text-center">
              <Link 
                href="/courses" 
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md inline-block"
              >
                Все курсы
              </Link>
            </div>
          </div>
        </section>

        {/* Призыв к действию */}
        <section className="py-16 bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Готовы начать обучение?
            </h2>
            <p className="text-white text-lg mb-8 max-w-3xl mx-auto">
              Зарегистрируйтесь сейчас и получите доступ к нашим курсам. Первый урок бесплатно!
            </p>
            <Link 
              href="/sign-up" 
              className="bg-white text-primary-600 hover:bg-gray-100 px-6 py-3 rounded-md inline-block font-medium"
            >
              Зарегистрироваться
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </LayoutWithHeader>
  )
}
