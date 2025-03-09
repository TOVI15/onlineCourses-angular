import { Component } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-manage-courses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './manage-courses.component.html',
  styleUrl: './manage-courses.component.css'
})
export class ManageCoursesComponent {
  courses: any[] = [];
  lessons: any[] = [];
  showForm = false;
  isEditing = false;
  formType: 'Course' | 'Lesson' = 'Course';
  currentItem: any = { title: '', description: '' };
  selectedCourse: any = null;
  techerId = this.extractUserIdFromToken(); // שימוש ב-Token לקבלת מזהה המשתמש

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    if (this.techerId !== -1) {
      this.loadCourses();
    } else {
      console.error('User ID not found!');
    }
  }

  loadCourses() {
    this.courseService.getEnrolledCourses(this.techerId).subscribe(
      data => this.courses = data,
      error => console.error('Error fetching courses:', error)
    );
  }

  private extractUserIdFromToken(): number {
    if (typeof window === 'undefined' || !sessionStorage.getItem('token')) return -1;
    try {
      const token = sessionStorage.getItem('token')!;
      const payload = JSON.parse(atob(token.split('.')[1])); // פענוח ה-JWT
      return typeof payload.userId === 'number' ? payload.userId : -1;
    } catch (error) {
      console.error('Error decoding token:', error);
      return -1;
    }
  }

  get currentCourseContent(): string {
    if (this.formType === 'Course') {
      return this.currentItem.description; 
    } else if (this.formType === 'Lesson') {
      return this.currentItem.content; 
    }
    return ''; 
  }
  set currentCourseContent(value: string) {
    if (this.formType === 'Course') {
      this.currentItem.description = value; 
    } else if (this.formType === 'Lesson') {
      this.currentItem.content = value; 
    }
  }
  openForm(item: any = null, type: 'Course' | 'Lesson' = 'Course', courseId: number | null = null) {
    this.isEditing = !!item;
    this.formType = type;
    this.currentItem = item ? { ...item } : { title: '', description: '' };
    if (courseId) this.selectedCourse = this.courses.find(c => c.id === courseId);
    this.showForm = true;
  }

  saveItem() {
    if (this.isEditing) {
      this.updateItem();
    } else {
      this.addItem();
    }
  }

  getLessonsForCourse(courseId: number){
    this.courseService.getLessonsByCourseId(courseId).subscribe(
      data => {
        this.lessons = data;
      },
      error => {
        console.error('Error fetching lessons:', error);
      }
    );
  }



  addItem() {
    if (this.formType === 'Course') {
      this.courseService.addCourse(this.currentItem).subscribe(() => this.loadCourses());
    } else if (this.selectedCourse) {
      const lessonData = {
        title: this.currentItem.title, 
        content: this.currentItem.description  
      };
      this.courseService.addLesson(this.selectedCourse.id, lessonData).subscribe(() => this.loadCourses());
    }
    this.showForm = false;
  }

  updateItem() {
    if (this.formType === 'Course') {
      this.courseService.updateCourse(this.currentItem.id, this.currentItem).subscribe(() => this.loadCourses());
    } else if (this.formType === 'Lesson' && this.selectedCourse) {
      const lessonData = {
        title: this.currentItem.title, 
        content: this.currentItem.content
      };
      this.courseService.updateLesson(this.selectedCourse.id, this.currentItem.id, lessonData).subscribe(() => this.loadCourses());
    }
    this.showForm = false;
  }

  deleteItem(id: number, type: 'Course' | 'Lesson', courseId?: number) {
    if (type === 'Course') {
      this.courseService.deleteCourse(id).subscribe(() => this.loadCourses());
    } else if (courseId) {
      this.courseService.deleteLesson(courseId, id).subscribe(() => this.loadCourses());
    }  
  }

  
  editCourse() {
    if (this.selectedCourse) {
      this.openForm(this.selectedCourse, 'Course');
    }
  }

  editLesson(lesson: any) {
    if (this.selectedCourse) {
      this.openForm(lesson, 'Lesson', this.selectedCourse.id);
    }
  }
}