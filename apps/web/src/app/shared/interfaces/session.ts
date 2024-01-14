export interface Session {
  avatar: {
    public_id: `avatars/${string}`;
    resource_type: 'image';
    secure_url: string;
    url: string;
    height: number;
    width: number;
    _id: string;
  };
  displayName: string;
  username: string;
  watchHistory: Array<string>;
}
