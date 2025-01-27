import React, { createContext, useContext, useState, ReactNode } from "react";

const defaultLightTint = "#062238";
const defaultDarkTint = "#1f81cc";

interface ColorContextType {
  tintLight: string;
  setTintLight: React.Dispatch<React.SetStateAction<string>>;
  tintDark: string;
  setTintDark: React.Dispatch<React.SetStateAction<string>>;
}

const ColorContext = createContext<ColorContextType>({
  tintLight: defaultLightTint,
  setTintLight: () => {},
  tintDark: defaultDarkTint,
  setTintDark: () => {},
});

export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const [tintLight, setTintLight] = useState(defaultLightTint);
  const [tintDark, setTintDark] = useState(defaultDarkTint);

  return (
    <ColorContext.Provider
      value={{ tintLight, setTintLight, tintDark, setTintDark }}
    >
      {children}
    </ColorContext.Provider>
  );
};

export const useColorContext = () => useContext(ColorContext);
