export type RootStackParamList = {
    Login: undefined;
    Agreement: undefined;
    SelectSetting: undefined;
    Research: undefined;
    ReviewSelector: undefined;
    Search: { modality: 'clinic' | 'research' };
    Clinic: undefined;
    ConnectDevice: { previousPage: 'Clinic' | 'Research' };
    CurrentStudy: undefined;
    PreviousStudy: undefined;
  };