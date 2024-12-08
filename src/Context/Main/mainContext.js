import React, { useState, createContext, useEffect } from "react";

export const MainContext = createContext();

const MainContextProvider = (props) => {
  const [mainState, setMainState] = useState({
    pwaInstallPropmt: null,
    settings: {
      pwaInstallPostponed: false
    }
  });


  useEffect(() => {
    const storedSettings = getItemWithExpiry('settings');
    if (storedSettings) {
      setMainState((prevState) => ({
        ...prevState,
        settings: storedSettings,
      }));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setMainState((prevState) => ({
        ...prevState,
        pwaInstallPropmt: e,
      }));
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', () => { })
    }
  }, [mainState]);

  const setItemWithExpiry = (key, value, expiryInMs) => {
    const now = new Date().getTime();
    const item = {
      value: value,
      expiry: now + expiryInMs,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  const getItemWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date().getTime();
    if (now > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  };


  const updateMainState = (key, value, store, expiryInMs = null) => {
    setMainState((prevState) => {
      const updatedState = {
        ...prevState,
        [key]: value,
      };

      if (store) {
        if (expiryInMs) {
          setItemWithExpiry("settings", updatedState.settings, expiryInMs);
        } else {
          localStorage.setItem("settings", JSON.stringify(updatedState.settings));
        }
      }

      return updatedState;
    });
  };


  return (
    <MainContext.Provider value={{ mainState, updateMainState }}>
      {props.children}
    </MainContext.Provider>
  )
}

export default MainContextProvider;