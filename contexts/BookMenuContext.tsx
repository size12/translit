import { createContext, ReactNode, useContext, useState } from 'react';

type BookMenuContextType = {
  bookId: string | null;
  isVisible: boolean;
  showMenu: (id: string) => void;
  hideMenu: () => void;
};

const BookMenuContext = createContext<BookMenuContextType>({
  bookId: null,
  isVisible: false,
  showMenu: () => {},
  hideMenu: () => {},
});

export const BookMenuProvider = ({ children }: { children: ReactNode }) => {
  const [bookId, setBookId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showMenu = (id: string) => {
    setBookId(id);
    setIsVisible(true);
  };

  const hideMenu = () => {
    setIsVisible(false);
    setBookId(null);
  };

  return (
    <BookMenuContext.Provider value={{ bookId, isVisible, showMenu, hideMenu }}>
      {children}
    </BookMenuContext.Provider>
  );
};

export const useBookMenu = () => useContext(BookMenuContext);
