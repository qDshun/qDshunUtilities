import { CommonModule } from "@angular/common";
import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { AuthCardComponent } from "../auth-card/auth-card.component";
import { ControlsOf } from "../../../helpers/controls-of.type";
import { IdentityService } from "../../../services/identity.service";
import { RegisterRequest } from "../../../models/request/register-request.model";


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatIconModule, AuthCardComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private formBuilder = inject(FormBuilder);
  private identityService = inject(IdentityService);

  public hidePassword = true;
  public hideConfirmPassword = true;

  private minPasswordLength = 8;
  registerForm: FormGroup<ControlsOf<RegisterRequest>> = this.formBuilder.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(this.minPasswordLength)]],
    confirmPassword: ['', Validators.required],
  });

  register() {
    if (this.registerForm.valid) {
      this.identityService.register(this.registerForm.getRawValue())
        .subscribe(() => this.identityService.redirectToLogin());
    }
  }
}
