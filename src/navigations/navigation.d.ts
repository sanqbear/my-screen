import {NavigatorScreenParams} from '@react-navigation/native';

export type DrawerParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  RecentlyAdded: NavigatorScreenParams<RecentlyAddedStackParamList>;
  RecentlyViewed: NavigatorScreenParams<RecentlyViewedStackParamList>;
  Library: NavigatorScreenParams<LibraryStackParamList>;
  Bookmarks: NavigatorScreenParams<BookmarksStackParamList>;
  Downloaded: NavigatorScreenParams<DownloadedStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export type HomeStackParamList = {
  HomeStack: undefined;
};

export type RecentlyAddedStackParamList = {
  RecentlyAddedStack: undefined;
  RecentlyAddedDetailsStack: {itemId: number};
  RecentlyAddedViewerStack: {itemId: number; page?: number};
};

export type RecentlyViewedStackParamList = {
  RecentlyViewedStack: undefined;
  RecentlyViewedDetailsStack: {itemId: number};
  RecentlyViewedViewerStack: {itemId: number; page?: number};
};

export type LibraryStackParamList = {
  LibraryStack: undefined;
  LibraryDetailsStack: {itemId: number};
  LibraryViewerStack: {itemId: number; page?: number};
};

export type BookmarksStackParamList = {
  BookmarksStack: undefined;
  BookmarksDetailsStack: {itemId: number};
  BookmarksViewerStack: {itemId: number; page?: number};
};

export type DownloadedStackParamList = {
  DownloadedStack: undefined;
  DownloadedDetailsStack: {itemId: number};
  DownloadedViewerStack: {itemId: number; page?: number};
};

export type SettingsStackParamList = {
  SettingsStack: undefined;
};
