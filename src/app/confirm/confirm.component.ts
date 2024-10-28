import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [  MatDialogModule ],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmComponent> 
  ) {}

  cancelClick(): void {
    this.dialogRef.close();
  }

  deleteClick():void {
    this.dialogRef.close(true);
  }
}
