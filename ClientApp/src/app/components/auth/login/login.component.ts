import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { ControlsOf } from "../../../helpers";
import { LoginRequest } from "../../../models";
import { IdentityService } from "../../../services";
import { AuthCardComponent } from "../auth-card/auth-card.component";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ MatFormFieldModule, MatButtonModule, MatInputModule, MatIconModule, AuthCardComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  private identityService = inject(IdentityService);
  public hidePassword = true;
  loginForm: FormGroup<ControlsOf<LoginRequest>> = this.formBuilder.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  rememberMe = true;

  constructor() { }

  ngOnInit() {
  }

  login(): void {
    this.identityService.login(this.loginForm.getRawValue(), this.rememberMe)
      .subscribe(() => this.identityService.redirectToHome());
  }
}
