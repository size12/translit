import { Location } from '@epubjs-react-native/core';

export interface BookMetadata {
  identifier: string;
  title: string;
  author: string;
  language: string;
}

export interface ReadingStatus {
  startedReading: boolean;
  progressPercent: number;
  lastLocation?: Location;
}

export interface Book {
  id: string;

  metadata: BookMetadata;
  status: ReadingStatus;

  coverImagePath: string;
  bookPath: string;
}
