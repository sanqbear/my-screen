export type ArtworkStackParamList = {
  ArtworkList: undefined;
  ArtworkDetail: {
    id: string;
  };
};

export type RootDrawerParamList = {
  Home: undefined;
  RecentList: undefined;
  ArtworkStack: {
    screen: keyof ArtworkStackParamList;
    params?: ArtworkStackParamList[keyof ArtworkStackParamList];
  };
  HistoryList: undefined;
  Setting: undefined;
};

export type RootStackParamList = RootDrawerParamList;

export default RootStackParamList;
