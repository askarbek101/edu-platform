export function Footer() {
  return (
    <footer className="bg-white w-full border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo and copyright */}
          <div className="flex flex-col">
            <div className="font-bold text-xl text-primary-600 mb-4">ЭдуПлатформа</div>
            <p className="text-sm text-gray-600">
              Качественное онлайн-образование для всех, кто стремится к развитию и новым знаниям.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              © {new Date().getFullYear()} ЭдуПлатформа. Все права защищены.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li>
                <a href="/courses" className="text-sm text-gray-600 hover:text-primary-600">
                  Все курсы
                </a>
              </li>
              <li>
                <a href="/about" className="text-sm text-gray-600 hover:text-primary-600">
                  О нас
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-gray-600 hover:text-primary-600">
                  Контакты
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: For Students */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Для студентов</h3>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="text-sm text-gray-600 hover:text-primary-600">
                  Личный кабинет
                </a>
              </li>
              <li>
                <a href="/courses" className="text-sm text-gray-600 hover:text-primary-600">
                  Мои курсы
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
                  Помощь
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: For Teachers */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Для преподавателей</h3>
            <ul className="space-y-2">
              <li>
                <a href="/teacher/courses" className="text-sm text-gray-600 hover:text-primary-600">
                  Управление курсами
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
                  Ресурсы
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary-600">
                  Поддержка
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Присоединяйтесь к нам в социальных сетях
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.22-1.13 6.93-.14.7-.42 1.27-1.13 1.27-.97 0-1.37-.72-2.07-1.27-.63-.48-1.23-.93-1.7-1.27-.63-.48-1.23-.93-1.7-1.27-.63-.48-.63-.7-.63-.93 0-.23.15-.48.63-.48s3.29 1.02 3.92 1.48c.63.47 1.06.47 1.27 0 .4-.93 1.47-4.32 1.5-4.74.03-.42-.15-.7-.63-.7s-1.27.23-3.92 1.48c-1.9.93-3.57 1.8-3.57 1.8-.23.15-.63.15-.63-.23V8.59c0-.48.15-.7.63-.93.48-.23 1.7-.7 2.34-.93.63-.23 3.57-1.27 4.4-1.27.83 0 1.27.23 1.27.93v2.4z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
