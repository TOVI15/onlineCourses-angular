import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { NewUserComponent } from '../components/new-user/new-user.component';
import { CoursesComponent } from '../components/courses/courses.component';
import { ManageCoursesComponent } from '../components/manage-courses/manage-courses.component';
import { HomeComponent } from '../components/home/home.component';
import { MyCoursesComponent } from '../components/my-courses/my-courses.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [] },
    { path: 'register', component: NewUserComponent },
    { path: 'home', component: HomeComponent },
    { path: 'courses', component: CoursesComponent },
    { path: 'my-courses', component: MyCoursesComponent, canActivate: [] },
    { path: 'manage-courses', component: ManageCoursesComponent, canActivate: []},
    { path: '', redirectTo: '/home', pathMatch: 'full' },
];
