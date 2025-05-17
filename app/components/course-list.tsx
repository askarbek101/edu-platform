import Link from "next/link";

export async function CourseList() {
  const response = await fetch('https://clerk-authentication-starter.onrender.com/api/courses', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  const allCourses = await response.json();
  // Get only the last 3 courses
  const courses = allCourses.slice(-3);
    
  return (
    <>
      {courses.length > 0 ? (
        courses.map((course: any) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200">
              {course.image && (
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {course.title}
              </h3>
              <p className="text-gray-700 mb-4">
                {course.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{course.lessonCount} уроков</span>
                <Link 
                  href={`/courses/${course.id}`} 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Подробнее
                </Link>
              </div>
            </div>
          </div>
        ))
      ) : (
        // Запасной вариант, если курсы не найдены
        <div className="col-span-3 text-center py-8">
          <p className="text-gray-500">Курсы скоро появятся</p>
        </div>
      )}
    </>
  );
} 