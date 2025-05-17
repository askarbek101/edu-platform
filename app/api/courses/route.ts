import { NextResponse } from 'next/server';
import { coursesDb } from '../db/database';
// Types
export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
}


export async function GET() {

  const courses = await coursesDb.getAll();

  return NextResponse.json(courses);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, image, lessonsCount, category, level, instructor } = body;
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    const newCourse = await coursesDb.create(
      title, 
      description, 
      instructor, 
      image, 
      lessonsCount, 
      category, 
      level
    );
    
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }
    
    const updatedCourse = await coursesDb.update(id, updateData);
    
    if (!updatedCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }
    
    await coursesDb.delete(Number(id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
} 