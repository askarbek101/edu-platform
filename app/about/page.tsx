import { LayoutWithHeader } from "../components/layout-with-header"
import Link from "next/link"
import Image from "next/image"
import { Footer } from "../components/footer"

export default function AboutPage() {
  return (
    <LayoutWithHeader>
      <main>
        {/* Заголовок страницы */}
        <section className="bg-primary-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                О нашей платформе
              </h1>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Мы создаем доступное и качественное онлайн-образование для всех, кто стремится к развитию и новым знаниям.
              </p>
            </div>
          </div>
        </section>

        {/* Наша миссия */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Наша миссия
                </h2>
                <p className="text-gray-700 mb-4">
                  Мы стремимся сделать качественное образование доступным для каждого, независимо от местоположения и финансовых возможностей. Наша платформа предоставляет удобный доступ к разнообразным курсам, которые помогут вам приобрести новые навыки и знания.
                </p>
                <p className="text-gray-700">
                  Мы верим, что образование должно быть интерактивным, увлекательным и эффективным. Поэтому мы постоянно совершенствуем нашу платформу, добавляя новые функции и улучшая пользовательский опыт.
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg p-8 h-full">
                <div className="flex flex-col h-full justify-center">
                  <div className="text-5xl font-bold text-primary-600 mb-4">
                    2023
                  </div>
                  <p className="text-gray-700 mb-2">
                    Год основания платформы
                  </p>
                  <div className="text-5xl font-bold text-primary-600 mb-4 mt-8">
                    1000+
                  </div>
                  <p className="text-gray-700 mb-2">
                    Довольных студентов
                  </p>
                  <div className="text-5xl font-bold text-primary-600 mb-4 mt-8">
                    50+
                  </div>
                  <p className="text-gray-700">
                    Качественных курсов
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Наша команда */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Наша команда
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Член команды 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    Александр Петров
                  </h3>
                  <p className="text-primary-600 mb-4">Основатель и CEO</p>
                  <p className="text-gray-700">
                    Опытный преподаватель с более чем 10-летним стажем в сфере образования и технологий.
                  </p>
                </div>
              </div>
              
              {/* Член команды 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    Екатерина Смирнова
                  </h3>
                  <p className="text-primary-600 mb-4">Руководитель разработки курсов</p>
                  <p className="text-gray-700">
                    Методист с опытом создания образовательных программ для различных возрастных групп.
                  </p>
                </div>
              </div>
              
              {/* Член команды 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    Дмитрий Иванов
                  </h3>
                  <p className="text-primary-600 mb-4">Технический директор</p>
                  <p className="text-gray-700">
                    Разработчик с глубокими знаниями в области веб-технологий и образовательных платформ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Наши принципы */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Наши принципы
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Доступность
                </h3>
                <p className="text-gray-700">
                  Мы стремимся сделать образование доступным для всех, независимо от местоположения и финансовых возможностей.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Качество
                </h3>
                <p className="text-gray-700">
                  Мы тщательно разрабатываем каждый курс, чтобы обеспечить высокое качество образовательного контента.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Гибкость
                </h3>
                <p className="text-gray-700">
                  Наша платформа позволяет учиться в удобном темпе и в любое время, адаптируясь под ваш график.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Сообщество
                </h3>
                <p className="text-gray-700">
                  Мы создаем дружественное сообщество учащихся и преподавателей для обмена знаниями и опытом.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Призыв к действию */}
        <section className="py-16 bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Присоединяйтесь к нам!
            </h2>
            <p className="text-white text-lg mb-8 max-w-3xl mx-auto">
              Начните свой путь к новым знаниям и навыкам уже сегодня. Регистрируйтесь на нашей платформе и получите доступ к качественным образовательным курсам.
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
