// Types
export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  lessonsCount: number;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
}

export interface Assignment {
  id: number;
  title: string;
  type: "test" | "input" | "drag";
  description: string;
}

// API service for courses
export const courseService = {
  // Get all courses
  async getAllCourses(): Promise<Course[]> {
    const response = await fetch('/api/courses');
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    return response.json();
  },

  // Get a single course by ID
  async getCourseById(id: number): Promise<Course> {
    const response = await fetch(`/api/courses/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch course');
    }
    return response.json();
  },

  // Get assignments for a course
  async getCourseAssignments(courseId: number): Promise<Assignment[]> {
    const response = await fetch(`/api/courses/${courseId}/assignments`);
    if (!response.ok) {
      throw new Error('Failed to fetch assignments');
    }
    return response.json();
  },

  // Get a single assignment by ID
  async getAssignmentById(id: number): Promise<Assignment> {
    const response = await fetch(`/api/assignments/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch assignment');
    }
    return response.json();
  },

  // Delete a course by ID
  async deleteCourse(id: number): Promise<boolean> {
    const response = await fetch(`/api/courses/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.ok;
  }
}; 