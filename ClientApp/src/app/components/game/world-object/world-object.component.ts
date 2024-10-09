import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NamedTreeNode } from '../../../services/tree-service';
import { WorldObjectResponse } from '../../../models';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-world-object[worldObjectNode]',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './world-object.component.html',
  styleUrl: './world-object.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldObjectComponent implements OnInit{
  @Input() worldObjectNode!: NamedTreeNode<WorldObjectResponse>;

  ngOnInit(): void {
      console.log(this.worldObjectNode)
  }
}
