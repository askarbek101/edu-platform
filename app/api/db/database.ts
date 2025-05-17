import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a connection pool using the DATABASE_URL from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// CRUD functions for courses
export const coursesDb = {
  // Create a new course
  async create(title: string, description?: string, instructor?: string, image?: string, lessonsCount?: number, category?: string, level?: string) {
    const result = await pool.query(
      'INSERT INTO courses (title, description, instructor, image, lessons_count, category, level) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, instructor, image, lessonsCount, category, level]
    );
    return result.rows[0];
  },

  // Get all courses
  async getAll() {
    const result = await pool.query('SELECT * FROM courses ORDER BY created_at DESC');
    return result.rows;
  },

  // Get a course by ID
  async getById(id: number) {
    console.log("getById", id);
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    console.log("result", result.rows);
    return result.rows[0] || null;
  },

  // Update a course
  async update(id: number, data: { 
    title?: string; 
    description?: string; 
    instructor?: string;
    image?: string;
    lessonsCount?: number;
    category?: string;
    level?: string;
  }) {
    const { title, description, instructor, image, lessonsCount, category, level } = data;
    const result = await pool.query(
      `UPDATE courses SET 
        title = COALESCE($1, title), 
        description = COALESCE($2, description), 
        instructor = COALESCE($3, instructor),
        image = COALESCE($4, image),
        lessons_count = COALESCE($5, lessons_count),
        category = COALESCE($6, category),
        level = COALESCE($7, level)
      WHERE id = $8 RETURNING *`,
      [title, description, instructor, image, lessonsCount, category, level, id]
    );
    return result.rows[0] || null;
  },

  // Delete a course
  async delete(id: number) {
    await pool.query('DELETE FROM courses WHERE id = $1', [id]);
    return true;
  },
  
  // Get courses by category
  async getByCategory(category: string) {
    const result = await pool.query('SELECT * FROM courses WHERE category = $1 ORDER BY created_at DESC', [category]);
    return result.rows;
  },
  
  // Get courses by level
  async getByLevel(level: string) {
    const result = await pool.query('SELECT * FROM courses WHERE level = $1 ORDER BY created_at DESC', [level]);
    return result.rows;
  }
};

// CRUD functions for assignments
export const assignmentsDb = {
  // Create a new assignment
  async create(courseId: number, title: string, description?: string, dueDate?: Date, points?: number) {
    const result = await pool.query(
      'INSERT INTO assignments (course_id, title, description, due_date, points) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [courseId, title, description, dueDate, points]
    );
    return result.rows[0];
  },

  // Get all assignments
  async getAll() {
    const result = await pool.query('SELECT * FROM assignments ORDER BY due_date ASC');
    return result.rows;
  },

  // Get assignments by course ID
  async getByCourseId(courseId: number) {
    const result = await pool.query('SELECT * FROM assignments WHERE course_id = $1 ORDER BY due_date ASC', [courseId]);
    return result.rows;
  },

  // Get an assignment by ID
  async getById(id: number) {
    const result = await pool.query('SELECT * FROM assignments WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  // Update an assignment
  async update(id: number, data: { title?: string; description?: string; dueDate?: Date; points?: number }) {
    const { title, description, dueDate, points } = data;
    const result = await pool.query(
      'UPDATE assignments SET title = COALESCE($1, title), description = COALESCE($2, description), due_date = COALESCE($3, due_date), points = COALESCE($4, points) WHERE id = $5 RETURNING *',
      [title, description, dueDate, points, id]
    );
    return result.rows[0] || null;
  },

  // Delete an assignment
  async delete(id: number) {
    await pool.query('DELETE FROM assignments WHERE id = $1', [id]);
    return true;
  }
};


// progress of user
export const userProgressDb = {
  // create a new user progress
  async create(userId: number, courseId: number, progress: number) {
    const result = await pool.query('INSERT INTO user_progress (user_id, course_id, progress) VALUES ($1, $2, $3) RETURNING *', [userId, courseId, progress]);
    return result.rows[0];
  },

  // get course progress by user id
  async getByUserId(userId: number) {
    const result = await pool.query('SELECT * FROM user_progress WHERE user_id = $1', [userId]);
    return result.rows;
  }
};

// CRUD functions for lessons
export const lessonsDb = {
  // Create a new lesson
  async create(assignmentId: number, title: string, content?: string, image?: string, video?: string, 
               answerA?: string, answerB?: string, answerC?: string, answerD?: string, rightAnswer?: string) {
    const result = await pool.query(
      'INSERT INTO lessons (assignment_id, title, content, image, video, answer_a, answer_b, answer_c, answer_d, right_answer) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [assignmentId, title, content, image, video, answerA, answerB, answerC, answerD, rightAnswer]
    );
    return result.rows[0];
  },

  // Get all lessons
  async getAll() {
    const result = await pool.query('SELECT * FROM lessons ORDER BY created_at ASC');
    return result.rows;
  },

  // Get lessons by assignment ID
  async getByAssignmentId(assignmentId: number) {
    const result = await pool.query('SELECT * FROM lessons WHERE assignment_id = $1 ORDER BY created_at ASC', [assignmentId]);
    return result.rows;
  },

  // Get a lesson by ID
  async getById(id: number) {
    const result = await pool.query('SELECT * FROM lessons WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  // Update a lesson
  async update(id: number, data: { 
    title?: string; 
    content?: string; 
    image?: string; 
    video?: string; 
    answerA?: string;
    answerB?: string;
    answerC?: string;
    answerD?: string;
    rightAnswer?: string 
  }) {
    const { title, content, image, video, answerA, answerB, answerC, answerD, rightAnswer } = data;
    const result = await pool.query(
      `UPDATE lessons SET 
        title = COALESCE($1, title), 
        content = COALESCE($2, content), 
        image = COALESCE($3, image),
        video = COALESCE($4, video),
        answer_a = COALESCE($5, answer_a),
        answer_b = COALESCE($6, answer_b),
        answer_c = COALESCE($7, answer_c),
        answer_d = COALESCE($8, answer_d),
        right_answer = COALESCE($9, right_answer)
      WHERE id = $10 RETURNING *`,
      [title, content, image, video, answerA, answerB, answerC, answerD, rightAnswer, id]
    );
    return result.rows[0] || null;
  },

  // Delete a lesson
  async delete(id: number) {
    await pool.query('DELETE FROM lessons WHERE id = $1', [id]);
    return true;
  }
};

// CRUD functions for users
export const usersDb = {
  // Create a new user
  async create(email: string, role: 'admin' | 'teacher' | 'student') {
    const result = await pool.query(
      'INSERT INTO users (email, role) VALUES ($1, $2) RETURNING *',
      [email, role]
    );
    return result.rows[0];
  },

  // Get user role by email (creates a new student user if not found)
  async getRoleByEmail(email: string) {
    const result = await pool.query('SELECT role FROM users WHERE email = $1', [email]);
    
    if (result.rows.length > 0) {
      return result.rows[0].role;
    } else {
      // User doesn't exist, create a new student user
      await pool.query(
        'INSERT INTO users (email, role) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
        [email, 'student']
      );
      return 'student';
    }
  },

  // Get users by role
  async getByRole(role: 'admin' | 'teacher' | 'student') {
    const result = await pool.query('SELECT * FROM users WHERE role = $1 ORDER BY email', [role]);
    return result.rows;
  },

  // Update a user
  async update(id: number, data: { 
    email?: string; 
    role?: 'admin' | 'teacher' | 'student';
  }) {
    const { email, role } = data;
    const result = await pool.query(
      `UPDATE users SET 
        email = COALESCE($1, email), 
        role = COALESCE($2, role)
      WHERE id = $3 RETURNING *`,
      [email, role, id]
    );
    return result.rows[0] || null;
  },

  // Delete a user
  async delete(id: number) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return true;
  },
};

// Export the pool for direct queries if needed
export default pool;
