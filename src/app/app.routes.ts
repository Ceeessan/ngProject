import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContentComponent } from './content/content.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { PlayerDeviceComponent } from './player-device/player-device.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    {path: "home", component: HomeComponent, title: "Homepage"},
    {path: "content", component: ContentComponent, title: "content"},
    {path: "playlist", component: PlaylistComponent , title: "playlist"},
    {path: "player-device", component: PlayerDeviceComponent , title: "player-device"},
    {path: "login", component: LoginComponent , title: "login"},
    {path: "register", component: RegisterComponent, title: "register"},
    {path: '', redirectTo: '/home', pathMatch: 'full'}
];
