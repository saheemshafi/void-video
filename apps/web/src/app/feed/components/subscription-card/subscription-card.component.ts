import { Component, Input } from '@angular/core';
import { Subscription } from '../../../shared/interfaces/api-response';

@Component({
  selector: 'app-subscription-card',
  templateUrl: './subscription-card.component.html',
  styleUrl: './subscription-card.component.scss',
})
export class SubscriptionCardComponent {
  @Input({ required: true }) subscription!: Subscription;
}
