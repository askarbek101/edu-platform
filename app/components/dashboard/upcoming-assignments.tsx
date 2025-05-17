export function UpcomingAssignments() {
  // Mock data for upcoming assignments
  const assignments = [
    {
      id: 1,
      title: "JavaScript Fundamentals Quiz",
      course: "Web Development Fundamentals",
      dueDate: "Tomorrow",
      status: "pending"
    },
    {
      id: 2,
      title: "CSS Layout Project",
      course: "Web Development Fundamentals",
      dueDate: "In 3 days",
      status: "pending"
    },
    {
      id: 3,
      title: "Data Structures Assignment",
      course: "Data Structures and Algorithms",
      dueDate: "Next week",
      status: "pending"
    }
  ];

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <div key={assignment.id} className="border-l-4 border-yellow-400 pl-3 py-2">
          <h3 className="font-medium text-gray-900">{assignment.title}</h3>
          <p className="text-sm text-gray-500">{assignment.course}</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
              Due {assignment.dueDate}
            </span>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 