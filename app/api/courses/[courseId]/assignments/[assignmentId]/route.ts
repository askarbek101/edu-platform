import { assignmentsDb } from '@/app/api/db/database';
import { NextResponse } from 'next/server';

// Types
export interface Assignment {
  id: number;
  title: string;
  type: "test" | "input" | "drag";
  description: string;
}

export async function GET(
  request: Request
) {
  // Extract IDs from the URL path segments
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  // Check if we have an assignment ID in the path
  if (pathParts.length >= 5 && pathParts[4] === 'assignments' && pathParts.length === 5) {
    // No assignment ID provided, return all assignments for the course
    const courseId = parseInt(pathParts[1]);
    const assignments = await assignmentsDb.getByCourseId(courseId);
    return NextResponse.json(assignments);
  } else {
    // Assignment ID provided, return specific assignment
    const assignmentId = parseInt(pathParts[pathParts.length - 1]);
    const assignment = await assignmentsDb.getById(assignmentId);
    
    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(assignment);
  }
} 