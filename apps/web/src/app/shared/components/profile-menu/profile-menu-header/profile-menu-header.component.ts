import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-menu-header',
  templateUrl: './profile-menu-header.component.html',
  styleUrl: './profile-menu-header.component.scss',
})
export class ProfileMenuHeaderComponent {
  @Input({ required: true }) displayName: string = '';
  @Input({ required: true }) avatar: string = '';
  @Input({ required: true }) username: string = '';
}
