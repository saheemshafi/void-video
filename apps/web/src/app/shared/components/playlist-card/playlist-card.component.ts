import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Playlist } from '~shared/interfaces/playlist';

@Component({
  selector: 'app-playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrl: './playlist-card.component.scss',
})
export class PlaylistCardComponent {
  @Input({ required: true }) playlist!: Playlist;
  private router = inject(Router);

  navigateToPlaylist() {
    if (this.playlist.totalVideos > 0) {
      this.router.navigate(['/watch', this.playlist.videos[0]], {
        queryParams: { list: this.playlist._id },
      });
    } else {
      this.router.navigate(['/playlists', this.playlist._id]);
    }
  }
}
