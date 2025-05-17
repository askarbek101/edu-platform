import Link from "next/link";

export function CourseCard({ course }: { course: any }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-32 bg-gray-200 relative">
        {course.image ? (
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{course.title}</h3>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-primary-600 h-2 rounded-full" 
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{course.progress}% complete</span>
          <Link 
            href={`/courses/${course.id}`}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
} 