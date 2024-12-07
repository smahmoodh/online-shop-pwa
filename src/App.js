import React, { useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { Layout, ConfigProvider } from 'antd';
import { isBrowser, isMobile, isTablet } from 'react-device-detect';
import HeaderComponent from './Components/Header/HeaderComponent';
import AuthContextProvider from './Context/Auth/authContext';
import CartState from './Context/Cart/CartState';
import FooterComponent from './Components/FooterComponent/FooterComponent';

import './Assets/css/main.css';

const { Header, Content, Footer } = Layout;



function App() {
  // Initialize deferredPrompt for use later to show browser install prompt.
  let deferredPrompt;
  useEffect(() => {
    const htmlTag = document.querySelector("html");

    if (isMobile) {
      import('./Assets/css/main_mobile_mode.css');
      htmlTag.classList.add('mode_mobile');
      htmlTag.classList.remove('mode_desktop');
    }
    else {
      htmlTag.classList.remove('mode_mobile');
      htmlTag.classList.add('mode_desktop');
    }

    

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI notify the user they can install the PWA
      showInstallPromotion();
      // Optionally, send analytics event that PWA install promo was shown.
      console.log(`'beforeinstallprompt' event was fired.`);
    });

    buttonInstall.addEventListener('click', async () => {
      // Hide the app provided install promotion
      hideInstallPromotion();
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      // Optionally, send analytics event with outcome of user choice
      console.log(`User response to the install prompt: ${outcome}`);
      // We've used the prompt and can't use it again, throw it away
      deferredPrompt = null;
    });

    window.addEventListener('appinstalled', () => {
      // Hide the app-provided install promotion
      hideInstallPromotion();
      // Clear the deferredPrompt so it can be garbage collected
      deferredPrompt = null;
      // Optionally, send analytics event to indicate successful install
      console.log('PWA was installed');
    });
    
  }, []);
  return (
    <AuthContextProvider>
      <CartState>
        <ConfigProvider direction="rtl" >
          {isBrowser || isTablet ?
            <Layout className="layout">
              <Header className="header">
                <HeaderComponent />
              </Header>
              <Content className='page'>
                <Outlet />
              </Content>
              <Footer className='footer'>
                <FooterComponent />
              </Footer>
            </Layout>
            : null}
          {isMobile ?
            <Layout className="layout">
              <Header className="header header-mobile">
                <HeaderComponent />
              </Header>
              <Content className='page'>
                <div className='container'>
                  <div className='wrapper clearfix'>
                    <div className='main-content sides'>
                      <Outlet />
                    </div>
                    <Footer className='footer'>
                      <FooterComponent />
                    </Footer>
                  </div>
                </div>
              </Content>
            </Layout>
            : null}
        </ConfigProvider>
      </CartState>
    </AuthContextProvider>
  );
}

export default App;
