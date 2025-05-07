import { AbstractControl,ValidationErrors,ValidatorFn } from "@angular/forms";

export function passwordMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('Password')?.value;
    const confirmPassword = group.get('ConfirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}