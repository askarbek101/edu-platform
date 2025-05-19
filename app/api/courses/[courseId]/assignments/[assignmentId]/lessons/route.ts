import { assignmentsDb, lessonsDb } from '@/app/api/db/database';
import { NextResponse } from 'next/server';

// Types
export interface Lesson {
  id: number;
  assignment_id: number;
  title: string;
  content?: string;
  image?: string;
  video?: string;
  answer_type: 'single' | 'multiple' | 'matching';
  answers?: string; // JSON string for answers data
  right_answer?: string; // JSON string for correct answers
  created_at?: Date;
}

export async function GET(
  request: Request
) {
  // Extract the course ID and assignment ID from the URL path segments
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  const assignmentIdIndex = pathParts.findIndex(segment => segment === 'assignments') + 1;
  const assignmentId = parseInt(pathParts[assignmentIdIndex]);

  const lessons = await lessonsDb.getByAssignmentId(assignmentId);

  if (!lessons) {
    return NextResponse.json(
      { error: "Lessons not found for this assignment" },
      { status: 404 }
    );
  }
  
  return NextResponse.json(lessons);
}

export async function POST(
  request: Request
) {
  try {
    // Extract the assignment ID from the URL path segments
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    const assignmentIdIndex = pathParts.findIndex(segment => segment === 'assignments') + 1;
    const assignmentId = parseInt(pathParts[assignmentIdIndex]);

    // Validate assignment exists
    const assignment = await assignmentsDb.getById(assignmentId);
    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Parse the request body
    const body = await request.json();
    
    // Create the lesson with the assignment ID
    const lesson = await lessonsDb.create(
      assignmentId,
      body.title,
      body.content,
      body.image,
      body.video,
      body.answer_type,
      body.answers,
      body.right_answer
    );

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error("Error creating lesson:", error);
    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request
) {
  try {
    // Get the lesson ID from the query parameters
    const url = new URL(request.url);
    const lessonId = parseInt(url.searchParams.get('id') || '');

    if (!lessonId || isNaN(lessonId)) {
      return NextResponse.json(
        { error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    // Parse the request body
    const body = await request.json();
    
    // Update the lesson
    const updatedLesson = await lessonsDb.update(lessonId, {
      title: body.title,
      content: body.content,
      image: body.image,
      video: body.video,
      answerType: body.answer_type,
      answers: body.answers,
      rightAnswer: body.right_answer
    });

    if (!updatedLesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json(
      { error: "Failed to update lesson" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request
) {
  try {
    // Get the lesson ID from the query parameters
    const url = new URL(request.url);
    const lessonId = parseInt(url.searchParams.get('id') || '');

    if (!lessonId || isNaN(lessonId)) {
      return NextResponse.json(
        { error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    // Delete the lesson
    await lessonsDb.delete(lessonId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return NextResponse.json(
      { error: "Failed to delete lesson" },
      { status: 500 }
    );
  }
} 