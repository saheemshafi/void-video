import { Component, Input, OnInit, inject } from '@angular/core';

import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Subject, Subscription, map, takeUntil, tap } from 'rxjs';
import { Channel } from '~shared/interfaces/user.interface';
import { AuthService } from '~shared/services/auth.service';
import { IFile } from '~/app/shared/interfaces/file.interface';

@Component({
  selector: 'app-channel-avatar',
  templateUrl: './channel-avatar.component.html',
  styleUrl: './channel-avatar.component.scss',
})
export class ChannelAvatarComponent implements OnInit {
  @Input({ required: true }) channel!: Channel;
  private authService = inject(AuthService);
  session$ = this.authService.session$;
  private uploadFinished$ = new Subject<IFile>();
  private avatarSubscription!: Subscription;

  ngOnInit(): void {
    this.avatarSubscription = this.uploadFinished$.subscribe((avatar) => {
      this.channel.avatar = avatar;
    });
  }

  showProgress(message: string) {
    console.log(message);
  }

  changeAvatar(e: Event) {
    const fileControl = e.target as HTMLInputElement;

    if (fileControl.files && fileControl.files.length == 1) {
      const file = fileControl.files[0];

      const subscription = this.authService
        .changeAvatar(file)
        .pipe(
          takeUntil(this.uploadFinished$),
          tap((event) => console.log(event)),
          map((event) => this.getEventMessage(event, file))
        )
        .subscribe((message) => {
          this.showProgress(message);
        });
    }
  }

  private getEventMessage(event: HttpEvent<any>, file: File) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file "${file.name}" of size ${file.size}.`;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = event.total
          ? Math.round((100 * event.loaded) / event.total)
          : 0;
        return `File "${file.name}" is ${percentDone}% uploaded.`;

      case HttpEventType.Response:
        this.uploadFinished$.next(event.body.data);
        return `File "${file.name}" was completely uploaded!`;

      default:
        return `File "${file.name}" surprising upload event: ${event.type}.`;
    }
  }

  ngOnDestroy(): void {
    this.avatarSubscription?.unsubscribe();
  }
}
