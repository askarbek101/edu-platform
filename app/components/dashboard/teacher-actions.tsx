import Link from "next/link";

export function TeacherActions() {
  const quickActions = [
    {
      id: 1,
      title: "Create New Course",
      description: "Start building a new course for your students",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      link: "/teacher/courses",
      color: "bg-green-100 text-green-700"
    },
    {
      id: 2,
      title: "Review Assignments",
      description: "Grade and provide feedback on student work",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      link: "/teacher/assignments",
      color: "bg-blue-100 text-blue-700"
    },
    {
      id: 3,
      title: "Student Progress",
      description: "Track how your students are performing",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      link: "/teacher/students",
      color: "bg-purple-100 text-purple-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {quickActions.map((action) => (
        <Link key={action.id} href={action.link}>
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow h-full">
            <div className={`${action.color} rounded-full p-2 inline-block mb-3`}>
              {action.icon}
            </div>
            <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
            <p className="text-sm text-gray-500">{action.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
} 