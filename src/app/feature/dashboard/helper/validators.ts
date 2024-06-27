import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static matchValidator(
    controlName: string,
    matchingControlName: string
  ): ValidatorFn {
    return (abstractControl: AbstractControl) => {
      const control = abstractControl.get(controlName);
      const matchingControl = abstractControl.get(matchingControlName);

      if (
        matchingControl!.errors &&
        !matchingControl!.errors?.['confirmedValidator']
      ) {
        return null;
      }

      if (control!.value !== matchingControl!.value) {
        const error = { confirmedValidator: 'Passwords do not match.' };
        matchingControl!.setErrors(error);
        return error;
      } else {
        matchingControl!.setErrors(null);
        return null;
      }
    };
  }
  static requireDigit(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const hasDigit = /\d/.test(control.value);
      return !hasDigit ? { requireDigit: { value: control.value } } : null;
    };
  }

  static requireNonAlphanumeric(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const hasNonAlphanumeric = /[^a-zA-Z0-9]/.test(control.value);
      return !hasNonAlphanumeric
        ? { requireNonAlphanumeric: { value: control.value } }
        : null;
    };
  }

  static requireUppercase(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const hasUppercase = /[A-Z]/.test(control.value);
      return !hasUppercase
        ? { requireUppercase: { value: control.value } }
        : null;
    };
  }

  static requireLowercase(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const hasLowercase = /[a-z]/.test(control.value);
      return !hasLowercase
        ? { requireLowercase: { value: control.value } }
        : null;
    };
  }

  static requiredLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValidLength = control.value
        ? control.value.length >= minLength
        : false;
      return !isValidLength
        ? { requiredLength: { value: control.value } }
        : null;
    };
  }

  static allowedUserNameCharacters(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValid = /^[a-zA-Z0-9@.]+$/.test(control.value);
      return !isValid
        ? { allowedUserNameCharacters: { value: control.value } }
        : null;
    };
  }

  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValidPhoneNumber = /^[0-9]*$/.test(control.value);
      return !isValidPhoneNumber
        ? { phoneNumber: { value: control.value } }
        : null;
    };
  }
}
