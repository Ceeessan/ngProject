import { Component } from '@angular/core';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent {

  constructor() {}

  addFileHandler() {
    const addFile = document.getElementById('fileInput') as HTMLInputElement;
    addFile.click();
  }

  redirectFileHandler(fileEvent: Event){
    const input =fileEvent.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      console.log('Selected file', file);

      const content = document.getElementById('content') as HTMLDivElement;

      content.textContent = file;
    }
  }

}
