export interface IFile {
  _id: string;
  public_id: string;
  resource_type: 'image' | 'video' | 'raw';
  secure_url: string;
  url: string;
  height: number;
  width: number;
  duration?: number;
}
