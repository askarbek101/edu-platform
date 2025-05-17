import { NextResponse } from 'next/server';
import { coursesDb } from '@/app/api/db/database';

export async function GET(
  request: Request
) {
  var id = request.url.split('/').pop();
  if (!id) {
    return NextResponse.json(
      { error: "Course ID is required" },
      { status: 400 }
    );
  }
  const courseId = parseInt(id);
  
  // Find the course with the matching ID
  const course = await coursesDb.getById(courseId);

  if (!course) {
    return NextResponse.json(
      { error: "Course not found" },
      { status: 404 }
    );
  }
  
  return NextResponse.json(course);
} 