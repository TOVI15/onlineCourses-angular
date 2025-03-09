import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // קבלת כל הקורסים
  getCourses(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // קבלת פרטי קורס לפי ID
  getCourseById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getEnrolledCourses(studentId: number) : Observable<any>{
    return this.http.get(`${this.apiUrl}/student/${studentId}`, { headers: this.getAuthHeaders() });
  }
  // קבלת שיעורים בקורס מסוים
  getLessonsByCourseId(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${courseId}/lessons`, { headers: this.getAuthHeaders() });
  }

  // הצטרפות לקורס
  joinCourse(courseId: string, userId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${courseId}/enroll`,
      { userId }, 
      { headers: this.getAuthHeaders() }
    );
  }

  // יציאה מקורס
  leaveCourse(courseId: number, userId: number): Observable<any> {
    const url = `http://localhost:3000/api/courses/${courseId}/unenroll`;
    return this.http.delete(url, { headers: this.getAuthHeaders(), body: { userId } });
  }
  addCourse(courseData: { title: string, description: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, courseData, { headers: this.getAuthHeaders() });
  }


  updateCourse(courseId: number, updates: { title?: string, description?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${courseId}`, updates, { headers: this.getAuthHeaders() });
  }
  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${courseId}`, { headers: this.getAuthHeaders() });
  }

  addLesson(courseId: number, courseData: { title: string, content: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${courseId}/lessons`,  courseData, { headers: this.getAuthHeaders() });
  }
  // עדכון שיעור לפי ID
  updateLesson(courseId: number, lessonId: number, updates: { title?: string, content?: string }): Observable<any> {
   console.log('updates', updates.title, updates.content);
   
    return this.http.put(`${this.apiUrl}/${courseId}/lessons/${lessonId}`,  updates, { headers: this.getAuthHeaders() });
  }

  // מחיקת שיעור לפי ID
  deleteLesson(courseId: number, lessonId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${courseId}/lessons/${lessonId}`);
  }
  
}
