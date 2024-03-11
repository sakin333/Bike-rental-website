import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    constructor(private snackbar: MatSnackBar) {}

    openSnackBar(message: string, action: string, panelClass: string, duration: number = 3000) {
        this.snackbar.open(message, action, {
          duration: duration,
          verticalPosition: 'top',
          panelClass: panelClass
        });
    }
}