import React from "react";

import Common from "Common";
import { CookiesProvider } from "react-cookie";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useStoreInitial, Store } from "Common/hooks/store";

import i18nextClient from "Common/services/i18next";
import apolloClient from "Common/services/apollo";

const App = () => {
  const state = useStoreInitial();

  return (
    <CookiesProvider>
      <BrowserRouter>
        <React.StrictMode>
          <I18nextProvider i18n={i18nextClient}>
            <ApolloProvider client={apolloClient}>
              <Store.Provider value={state}>
                <SafeAreaProvider>
                  <Common />
                </SafeAreaProvider>
              </Store.Provider>
            </ApolloProvider>
          </I18nextProvider>
        </React.StrictMode>
      </BrowserRouter>
    </CookiesProvider>
  );
};

export default App;
