import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';

import { PlaylistService } from '~shared/services/playlist.service';
import { Playlist } from '~shared/interfaces/playlist.interface';

@Component({
  selector: 'app-playlists-page',
  templateUrl: './playlists-page.component.html',
  styleUrl: './playlists-page.component.scss',
})
export class PlaylistsPageComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private playlistService = inject(PlaylistService);
  playlists$!: Observable<Playlist[]>;
  placeholders = Array.from(new Array(6), (_, i) => i);

  ngOnInit(): void {
    if (!this.activatedRoute.parent) return;
    this.playlists$ = this.activatedRoute.parent?.paramMap.pipe(
      switchMap((params) =>
        this.playlistService
          .getPlaylists({
            username: <string>params.get('username'),
          })
          .pipe(map((response) => response.playlists))
      )
    );
  }
}
