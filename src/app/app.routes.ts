import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContentComponent } from './content/content.component';
import { PlaylistComponent } from './playlist/playlist.component';



export const routes: Routes = [
    {path: "home", component: HomeComponent, title: "Homepage"},
    {path: "content", component: ContentComponent, title: "Homepage"},
    {path: "playlist", component: PlaylistComponent , title: "Homepage"},
    {path: '', redirectTo: '/home', pathMatch: 'full'}
];
