import { Component, ChangeDetectionStrategy, OnInit, Input } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { IGurpsAttribute } from "@models/business";


@Component({
  selector: 'app-trainable-attribute',
  standalone: true,
  imports: [MatIconModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './trainable-attribute.component.html',
  styleUrl: './trainable-attribute.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainableAttributeComponent implements OnInit {
  @Input({required: true}) attribute!: IGurpsAttribute;
  expFormControl!: FormControl<number | null>;

  ngOnInit(): void {
    // Moved here instead of constructor/declaration
    // Because for some unknown reason this.attribute.expSpent() is not being initialised for Multidependant attributes
    this.expFormControl = new FormControl<number>(this.attribute.expSpent(), [Validators.required])
  }

}
