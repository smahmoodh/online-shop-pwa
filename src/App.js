import React, { useContext, useEffect, useState } from 'react';
import { Outlet } from "react-router-dom";
import { Layout, ConfigProvider, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { isBrowser, isMobile, isTablet } from 'react-device-detect';
import HeaderComponent from './Components/Header/HeaderComponent';
import { MainContext } from './Context/Main/mainContext';
import AuthContextProvider from './Context/Auth/authContext';
import CartState from './Context/Cart/CartState';
import FooterComponent from './Components/FooterComponent/FooterComponent';

import './Assets/css/main.css';

const { Header, Content, Footer } = Layout;
const { confirm } = Modal;


function App() {
  const { mainState, updateMainState } = useContext(MainContext);
  console.log(mainState);
  
  // Initialize deferredPrompt for use later to show browser install prompt.
  let deferredPrompt;
  const [dismissedPwa, setDismissedPwa] = useState(false)
  const showInstallPromotion = () => {
    confirm({
      title: 'نصب اپلیکیشن آنلاین شاپ',
      icon: <ExclamationCircleFilled />,
      content: 'برای استفاده آسان و در دسترس',
      okText: 'نصب',
      cancelText: 'بعدا',
      onOk() {
        buttonInstall()
      },
      onCancel() {
        console.log('Cancel');
        hideInstallPromotion();
      },
    });
  };
  const buttonInstall = async() => {
    console.log('buttonInstall clicked');
    
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
console.log(typeof(outcome));

    if (outcome == 'dismissed') {
      console.log('dddddddddd');
      
      // Hide the app provided install promotion
      hideInstallPromotion();
      setDismissedPwa(true);
    }
    // We've used the prompt and can't use it again, throw it away
    deferredPrompt = null;

  }
  const hideInstallPromotion = () => {
    // Update settings to mark PWA installation as postponed
    updateMainState('settings', {
      ...mainState.settings,
      pwaInstallPostponed: true,
    }, true, 24 * 60 * 60 * 1000);
    Modal.destroyAll();
  }

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
  }, []);

  useEffect(() => {
    if (
      mainState.pwaInstallPropmt &&
      !mainState.settings.pwaInstallPostponed
    ) {
      showInstallPromotion();
    }
  }, [mainState]);

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
