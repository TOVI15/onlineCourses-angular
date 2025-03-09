import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  userId: number | undefined;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.userId = this.extractUserIdFromToken();
    this.getCourses();
  }

  getCourses() {
    this.courseService.getCourses().subscribe(
      data => {
        this.courses = data;
        if (this.userId) {
          this.syncEnrollmentStatus();
        }
      },
      error => {
        console.error('Error fetching courses:', error);
      }
    );
  }

  toggleEnrollment(course: any) {
    if (this.userId === undefined) {
      console.error('User ID not found!');
      alert('You must be logged in to join or leave a course.');
      return;
    }

    if (course.isJoined) {
      this.courseService.leaveCourse(course.id, this.userId).subscribe(
        () => {
          course.isJoined = false;
          this.updateLocalEnrollment(course.id, false);
        },
        error => {
          console.error('Error leaving course:', error);
          alert('An error occurred while leaving the course.');
        }
      );
    } else {
      this.courseService.joinCourse(course.id, this.userId.toString()).subscribe(
        () => {
          course.isJoined = true;
          this.updateLocalEnrollment(course.id, true);
        },
        error => {
          console.error('Error joining course:', error);
          alert('An error occurred while joining the course.');
        }
      );
    }
  }

  private extractUserIdFromToken(): number | undefined {
    if (typeof window === 'undefined' || !sessionStorage.getItem('token')) return undefined;

    try {
      const token = sessionStorage.getItem('token')!;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return typeof payload.userId === 'number' ? payload.userId : undefined;
    } catch (error) {
      console.error('Error decoding token:', error);
      return undefined;
    }
  }

  private syncEnrollmentStatus() {
    if (this.userId === undefined) return;
  
    this.courseService.getEnrolledCourses(this.userId).subscribe(
      (enrolledCourses: any[]) => {
        // יצירת מערך מזהי הקורסים שהמשתמש רשום אליהם
        const enrolledCourseIds = enrolledCourses.map(course => course.id);
  
        // סנכרון סטטוס isJoined ברשימת הקורסים
        this.courses.forEach(course => {
          course.isJoined = enrolledCourseIds.includes(course.id);
        });
  
        // שמירת הסטטוס ב-sessionStorage
        this.saveEnrollmentStatusLocally(enrolledCourseIds);
      },
      error => {
        console.error('Error fetching enrolled courses:', error);
      }
    );
  }
  

  private updateLocalEnrollment(courseId: number, isJoined: boolean) {
    const enrolledCourses = JSON.parse(sessionStorage.getItem('enrolledCourses') || '{}');
    if (isJoined) {
      enrolledCourses[courseId] = true;
    } else {
      delete enrolledCourses[courseId];
    }
    sessionStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
  }

  private saveEnrollmentStatusLocally(enrolledCourseIds: number[]) {
    const enrolledCourses: { [key: number]: boolean } = {};
    enrolledCourseIds.forEach(courseId => {
      enrolledCourses[courseId] = true;
    });
    sessionStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
  }
}
