import { NextRequest, NextResponse } from 'next/server';
import { usersDb } from '../db/database';

// GET endpoint to fetch users by role
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    
    if (!role) {
      return NextResponse.json({ error: 'Role parameter is required' }, { status: 400 });
    }
    
    if (!['admin', 'teacher', 'student'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role. Must be admin, teacher, or student' }, { status: 400 });
    }
    
    const users = await usersDb.getByRole(role as 'admin' | 'teacher' | 'student');
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST endpoint to get or create a user by email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    const role = await usersDb.getRoleByEmail(email);
    return NextResponse.json({ email, role });
  } catch (error) {
    console.error('Error processing user:', error);
    return NextResponse.json({ error: 'Failed to process user' }, { status: 500 });
  }
}

// PUT endpoint to update a user by ID
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, role } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Validate role if provided
    if (role && !['admin', 'teacher', 'student'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role. Must be admin, teacher, or student' }, { status: 400 });
    }
    
    // Create update data object with only provided fields
    const updateData: { email?: string; role?: 'admin' | 'teacher' | 'student' } = {};
    if (email) updateData.email = email;
    if (role) updateData.role = role as 'admin' | 'teacher' | 'student';
    
    const updatedUser = await usersDb.update(id, updateData);
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}




