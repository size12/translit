import { createContext, ReactNode, useContext, useState } from "react"

type TranslateModalContextType = {
    word: string,
    language: string,
    isVisible: boolean
    translateWord: (word: string, languageCode: string) => void
    hideMenu: () => void
}

const TranslateModalContext = createContext<TranslateModalContextType>({
    word: "",
    language: "",
    isVisible: false,
    translateWord: () => {},
    hideMenu: () => {}
})

export const TranslateModalProvider = ({children} : {children: ReactNode}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [word, setWord] = useState("");
    const [language, setLanguage] = useState("");

    const translateWord = (word: string, language: string) => {
        word = word.trim().toLowerCase()
        language = language.trim().toLowerCase()

        if (!word || !language) return
        
        setIsVisible(true)
        setWord(word)
        setLanguage(language)
    }

    const hideMenu = () => {
        setIsVisible(false)
        setWord("")
        setLanguage("")
    }

    return (
        <TranslateModalContext.Provider value={{word, language, isVisible, translateWord, hideMenu}} >
            {children}
        </TranslateModalContext.Provider>
    )
}

export const useTranslateModal = () => useContext(TranslateModalContext);