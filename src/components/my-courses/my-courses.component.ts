import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CourseService } from '../../services/course.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css'
})

export class MyCoursesComponent implements OnInit {
  selectedCourseId: number = 0;
  selectedCourse: any = null;
  courses: any[] = [];
  lessons: any[] = [];
  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.getMyCourses();
  }
 
  getMyCourses() {
    const studentId = this.extractUserIdFromToken();
    if (studentId === -1) {
      console.error('User ID not found!');
      return;
    }
  
    this.courseService.getEnrolledCourses(studentId).subscribe(
      data => {
        this.courses = data;
        console.log('Enrolled courses:', this.courses);
      },
      error => {
        console.error('Error fetching enrolled courses:', error);
      }
    );
  }
  
  

  private extractUserIdFromToken(): number {
    if (typeof window === 'undefined' || !sessionStorage.getItem('token')) {
      return -1;
    }
      try {
        const token = sessionStorage.getItem('token')!;
        const payload = JSON.parse(atob(token.split('.')[1])); // פענוח ה-JWT
        return typeof payload.userId === 'number' ? payload.userId : -1;
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    return -1;
  }
  getInfomtionForCourse(courseId: number) {
    this.courseService.getCourseById(courseId).subscribe(
      (course: any) => {
        this.selectedCourse = course;
        this.getLessonsForCourse(courseId);
      },
      (error) => {
        console.error('Error fetching course information:', error);
      }
    );
  }
  // פונקציה להחזרת שיעורים לקורס מסוים
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

  // פונקציה להורדת חומרי שיעור
  downloadMaterial(lesson: any) {
    const a = document.createElement('a');
    a.href = lesson.materialUrl; 
    a.download = lesson.title;
    a.click();
  }
}

