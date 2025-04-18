import { createContext, ReactNode, useContext, useState } from 'react';

type LanguagePickerContextType = {
  isOpened: boolean;
  openPicker: () => void;
  closePicker: () => void;
};

const LanguagePickerContext = createContext<LanguagePickerContextType>({
  isOpened: false,
  openPicker: () => {},
  closePicker: () => {}
});

export const LanguagePickerProvider = ({ children }: { children: ReactNode }) => {
  const [isOpened, setIsOpened] = useState(false);

  const openPicker = () => {
    setIsOpened(true);
  };

  const closePicker = () => {
    setIsOpened(false);
  };

  return (
    <LanguagePickerContext.Provider value={{ isOpened, openPicker, closePicker }}>
      {children}
    </LanguagePickerContext.Provider>
  );
};

export const useLanguagePicker = () => useContext(LanguagePickerContext);
