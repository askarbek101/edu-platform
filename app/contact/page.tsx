"use client";

import { LayoutWithHeader } from "../components/layout-with-header";
import { Footer } from "../components/footer";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import React from "react";

// Объявляем типы для 2GIS API
declare global {
  interface Window {
    DG: any;
    mapgl?: any;
    MapGL?: any;
    map?: any;
  }
}

export default function ContactPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let mapInstance = null;
    
    // Проверяем, что мы в браузере
    if (typeof window !== "undefined") {
      // Очищаем предыдущую карту, если она существует
      if (window.map) {
        window.map.destroy();
        window.map = undefined;
      }
      
      // Функция для инициализации карты
      const initMap = () => {
        // Проверяем, что API загружен и контейнер существует
        if (window.mapgl && mapContainerRef.current && !window.map) {
          // Координаты для проспекта Сейфулина 546, Алматы, Казахстан
          const coordinates = [76.94674, 43.25667]; // Долгота, широта (в 2GIS MapGL порядок координат: [lon, lat])
          
          try {
            // Создаем экземпляр карты
            mapInstance = new window.mapgl.Map('map-container', {
              center: coordinates,
              zoom: 16,
              key: '6abc0bfc-68fc-4a4c-9ad0-8ea5cea538de', // Демо-ключ 2GIS для тестирования
            });
            
            // Сохраняем ссылку на карту для последующего удаления
            window.map = mapInstance;
            
            // Добавляем маркер на карту
            new window.mapgl.Marker(mapInstance, {
              coordinates: coordinates,
            });
          } catch (error) {
            console.error("Error initializing map:", error);
          }
        }
      };
      
      // Создаем скрипт для загрузки 2GIS API только если он еще не загружен
      if (!document.querySelector('script[src="https://mapgl.2gis.com/api/js/v1"]')) {
        const script = document.createElement("script");
        script.src = "https://mapgl.2gis.com/api/js/v1";
        script.async = true;
        
        // Инициализируем карту только после загрузки скрипта
        script.onload = () => {
          // Используем requestAnimationFrame для гарантии, что DOM полностью отрисован
          window.requestAnimationFrame(() => {
            setTimeout(initMap, 300);
          });
        };
        
        document.head.appendChild(script);
      } else if (window.mapgl) {
        // Если скрипт уже загружен, просто инициализируем карту
        window.requestAnimationFrame(() => {
          setTimeout(initMap, 300);
        });
      }
    }

    return () => {
      // Удаляем карту при размонтировании компонента
      if (window.map) {
        window.map.destroy();
        window.map = undefined;
      }
    };
  }, []);

  // Создаем компонент для контейнера карты
  const MapContainer = React.memo(() => {
    return (
      <div 
        id="map-container" 
        style={{ 
          width: '100%', 
          height: '500px', 
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '0.5rem'
        }}
        ref={mapContainerRef}
      ></div>
    );
  }, () => true);

  return (
    <LayoutWithHeader>
      <main>
        <section className="py-16 bg-primary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
              Свяжитесь с нами
            </h1>
            <p className="text-lg text-center text-gray-700 mb-12 max-w-3xl mx-auto">
              У вас есть вопросы о наших курсах или вам нужна помощь? Мы всегда готовы помочь!
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Контактная информация
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Адрес</h3>
                      <p className="mt-1 text-gray-700">
                        г. Алматы, пр. Сейфулина 546
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Email</h3>
                      <p className="mt-1 text-gray-700">
                        <a href="mailto:info@eduplatforma.ru" className="text-primary-600 hover:text-primary-700">
                          info@eduplatforma.ru
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Телефон</h3>
                      <p className="mt-1 text-gray-700">
                        <a href="tel:+78001234567" className="text-primary-600 hover:text-primary-700">
                          +7 (700) 707-77-00
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Время работы</h3>
                      <p className="mt-1 text-gray-700">
                        Пн-Пт: 9:00 - 18:00<br />
                        Сб-Вс: Выходные
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
                  Напишите нам
                </h2>
                <form className="space-y-6 p-6 bg-white rounded-lg shadow-lg border border-gray-100">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Имя
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Сообщение
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none"
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Отправить
                    </button>
                  </div>
                </form>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Наше местоположение
                </h2>
                <div className="w-full h-[500px] rounded-lg shadow-md">
                  <MapContainer />
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
