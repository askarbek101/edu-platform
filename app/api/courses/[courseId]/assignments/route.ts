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
  // Extract the course ID from the URL path segments
  const pathname = new URL(request.url).pathname;
  const segments = pathname.split('/');
  const courseIdIndex = segments.findIndex(segment => segment === 'courses') + 1;
  const courseId = parseInt(segments[courseIdIndex]);

  const assignments = await assignmentsDb.getByCourseId(courseId);
  
  if (!assignments) {
    return NextResponse.json(
      { error: "Assignments not found for this course" },
      { status: 404 }
    );
  }
  
  return NextResponse.json(assignments);
}

export async function POST(
  request: Request
) {
  try {
    // Extract the course ID from the URL path segments
    const pathname = new URL(request.url).pathname;
    const segments = pathname.split('/');
    const courseIdIndex = segments.findIndex(segment => segment === 'courses') + 1;
    const courseId = parseInt(segments[courseIdIndex]);

    // Parse the request body
    const body = await request.json();
    const { title, description, type, dueDate, points } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: "Assignment title is required" },
        { status: 400 }
      );
    }

    // Create the new assignment
    const newAssignment = await assignmentsDb.create(
      courseId,
      title,
      description,
      dueDate ? new Date(dueDate) : undefined,
      points
    );

    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { error: "Failed to create assignment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request
) {
  try {
    // Get the assignment ID from the URL query parameters
    const url = new URL(request.url);
    const assignmentId = url.searchParams.get('id');

    if (!assignmentId) {
      return NextResponse.json(
        { error: "Assignment ID is required" },
        { status: 400 }
      );
    }

    // Delete the assignment
    await assignmentsDb.delete(parseInt(assignmentId));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json(
      { error: "Failed to delete assignment" },
      { status: 500 }
    );
  }
} 