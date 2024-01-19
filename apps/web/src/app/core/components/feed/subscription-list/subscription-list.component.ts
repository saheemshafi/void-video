import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from '../../../../shared/interfaces/user';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrl: './subscription-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionListComponent {
  @Input({ required: true, alias: 'subscriptions' })
  subscriptions$!: Observable<Subscription[]>;
}
