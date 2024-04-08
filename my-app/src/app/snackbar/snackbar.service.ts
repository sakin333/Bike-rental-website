import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  public openSnackBar(
    message: string,
    action: string,
    panelClass: string = 'my-custom-snackbar',
    duration: number = 3000
  ) {
    this.snackbar.open(message, action, {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: panelClass,
    });
  }
}
