import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export const ThemeButton = ({ ...props }) => {
    
    const [darkMode, setDarkMode] = useState<boolean | undefined>(undefined);
    useEffect(() => {
        const shouldBeDark = localStorage.getItem("alphaDarkMode") === "true";
        const isCurrentDark = document.documentElement.classList.contains("dark");
        if (shouldBeDark !== isCurrentDark) {
            // nightwind.toggle();
        }
        setDarkMode(shouldBeDark);
    }, []);

    const onClick = () => {
        //   nightwind.toggle();
        window.localStorage.setItem("alphaDarkMode", `${!darkMode}`);
        //   SetStateDarkMode(!darkMode);
        setDarkMode(!darkMode);
    };

    return (
        <button
            className="flex items-center h-full text-gray-700 mr-5"
            onClick={onClick}
        >
            {
                darkMode ? <FaMoon className="h-7 w-7" /> : <FaSun className="h-7 w-7" />
            }
        </button>
    );
};