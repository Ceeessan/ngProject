import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContentComponent } from './content/content.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { PlayerDeviceComponent } from './player-device/player-device.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { guardGuard } from '../auth-service/guard.guard';
import { PlayerComponent } from './player/player.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: "home", component: HomeComponent, title: "Homepage", canActivate: [guardGuard]},
    {path: "content", component: ContentComponent, title: "content", canActivate: [guardGuard]},
    {path: "playlist", component: PlaylistComponent , title: "playlist", canActivate: [guardGuard]},
    {path: "player-device", component: PlayerDeviceComponent , title: "player-device", canActivate: [guardGuard]},
    {path: "login", component: LoginComponent , title: "login"},
    {path: "register", component: RegisterComponent, title: "register"},  
    // {path: "player", component: PlayerComponent, title: "player"},   

];
