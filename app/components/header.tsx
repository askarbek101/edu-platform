"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { UserProfileModal } from "./user-profile-modal";

export function Header() {
  const pathname = usePathname();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch user role when user is available
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.emailAddresses?.[0]?.emailAddress) {
        try {
          const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.emailAddresses[0].emailAddress,
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            setUserRole(data.role);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };

    if (user) {
      fetchUserRole();
    }
  }, [user]);

  // Функция для проверки активного пути
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  // Получение инициалов пользователя
  const getInitials = () => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center">
          <Link href="/" className="font-bold text-xl text-primary-600">
            ЭдуПлатформа
          </Link>
        </div>
        
        {/* Десктопное меню */}
        <nav className="hidden md:flex space-x-8">
          <Link 
            href="/courses" 
            className={`${isActive('/courses') ? 'text-primary-600 font-medium' : 'text-gray-700 hover:text-primary-600'}`}
          >
            Курсы
          </Link>
          <Link 
            href="/about" 
            className={`${isActive('/about') ? 'text-primary-600 font-medium' : 'text-gray-700 hover:text-primary-600'}`}
          >
            О нас
          </Link>
          <Link 
            href="/contact" 
            className={`${isActive('/contact') ? 'text-primary-600 font-medium' : 'text-gray-700 hover:text-primary-600'}`}
          >
            Контакты
          </Link>
        </nav>
        
        {/* Кнопки авторизации */}
        <div className="hidden md:flex items-center space-x-4">
          <SignedOut>
            <Link 
              href="/sign-in" 
              className={`${isActive('/sign-in') ? 'text-primary-700' : 'text-primary-600 hover:text-primary-700'}`}
            >
              Войти
            </Link>
            <Link 
              href="/sign-up" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            >
              Регистрация
            </Link>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center space-x-3">
              <Link 
                href="/dashboard" 
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
              >
                Личный кабинет
              </Link>
              {/* Admin Panel button - only visible for admin or teacher roles */}
              {(userRole === 'admin' || userRole === 'teacher') && (
                <Link 
                  href="/admin" 
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md"
                >
                  Админ панель
                </Link>
              )}
              <button 
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center justify-center"
              >
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.fullName || "Пользователь"} 
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
                    {getInitials()}
                  </div>
                )}
              </button>
            </div>
          </SignedIn>
        </div>
        
        {/* Кнопка мобильного меню */}
        <div className="md:hidden">
          <button
            type="button"
            className="text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-3 space-y-2 bg-white border-t border-gray-200">
          <Link 
            href="/courses" 
            className={`block py-2 ${isActive('/courses') ? 'text-primary-600 font-medium' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Курсы
          </Link>
          <Link 
            href="/about" 
            className={`block py-2 ${isActive('/about') ? 'text-primary-600 font-medium' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            О нас
          </Link>
          <Link 
            href="/contact" 
            className={`block py-2 ${isActive('/contact') ? 'text-primary-600 font-medium' : 'text-gray-700'}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Контакты
          </Link>
          
          <div className="pt-2 border-t border-gray-200 mt-2">
            <SignedOut>
              <div className="flex flex-col space-y-2">
                <Link 
                  href="/sign-in" 
                  className="text-primary-600 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Войти
                </Link>
                <Link 
                  href="/sign-up" 
                  className="bg-primary-600 text-white py-2 px-4 rounded-md text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Регистрация
                </Link>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex flex-col space-y-2">
                <Link 
                  href="/dashboard" 
                  className="text-primary-600 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Личный кабинет
                </Link>
                {/* Admin Panel button in mobile menu - only visible for admin or teacher roles */}
                {(userRole === 'admin' || userRole === 'teacher') && (
                  <Link 
                    href="/admin" 
                    className="text-gray-700 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Админ панель
                  </Link>
                )}
              </div>
            </SignedIn>
          </div>
        </div>
      )}
      
      {/* Модальное окно профиля */}
      {profileModalOpen && (
        <UserProfileModal 
          isOpen={profileModalOpen} 
          onClose={() => setProfileModalOpen(false)} 
        />
      )}
    </header>
  );
} 