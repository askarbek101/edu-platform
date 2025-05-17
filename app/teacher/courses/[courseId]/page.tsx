"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { LayoutWithHeader } from "../../../components/layout-with-header";
import { Footer } from "../../../components/footer";
import Link from "next/link";

interface CourseFormData {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  lessonsCount?: number;
  instructor?: string;
}

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = parseInt(params.courseId as string);
  
  const [formData, setFormData] = useState<CourseFormData>({
    id: courseId,
    title: "",
    description: "",
    image: "",
    category: "",
    level: "beginner",
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Fetch current course data
  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch course");
        }
        const courseData = await response.json();
        setFormData(courseData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course information. Please try again later.");
        setLoading(false);
      }
    }
    
    fetchCourse();
  }, [courseId]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      const response = await fetch("/api/courses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update course");
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push(`/teacher/courses`);
      }, 1500);
    } catch (err) {
      console.error("Error updating course:", err);
      setError("Failed to update course. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <LayoutWithHeader>
        <main className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-700">Loading course information...</p>
            </div>
          </div>
        </main>
        <Footer />
      </LayoutWithHeader>
    );
  }
  
  return (
    <LayoutWithHeader>
      <main className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link 
              href="/teacher/courses"
              className="text-primary-600 hover:text-primary-700 flex items-center mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Courses
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
          </div>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              Course updated successfully! Redirecting...
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 shadow"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 shadow"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 shadow"
              />
              {formData.image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <img 
                    src={formData.image} 
                    alt="Course preview" 
                    className="h-32 w-auto object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 shadow"
                />
              </div>
              
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                  Level *
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 shadow"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="lessonsCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Lessons
                </label>
                <input
                  type="number"
                  id="lessonsCount"
                  name="lessonsCount"
                  value={formData.lessonsCount || ""}
                  onChange={handleChange}
                  min="0"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 shadow"
                />
              </div>
              
              <div>
                <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor
                </label>
                <input
                  type="text"
                  id="instructor"
                  name="instructor"
                  value={formData.instructor || ""}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 shadow"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Link
                href="/teacher/courses"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className={`px-4 py-2 rounded-md text-white ${
                  saving 
                    ? "bg-primary-400 cursor-not-allowed" 
                    : "bg-primary-600 hover:bg-primary-700"
                }`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </LayoutWithHeader>
  );
}
