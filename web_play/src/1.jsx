import "Common/services/moment";

import React, { useState } from "react";

import Common from "Common";
import { CookiesProvider } from "react-cookie";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";

import { initialStore, Store } from "Common/hooks/store";

import i18nextClient from "Common/services/i18next";
import apolloClient from "Common/services/apollo";

const Providers = () => {
  const [store, setStore] = useState(initialStore);

  return (
    <CookiesProvider>
      <BrowserRouter>
        <React.StrictMode>
          <I18nextProvider i18n={i18nextClient}>
            <ApolloProvider client={apolloClient}>
              <Store.Provider value={[store, setStore]}>
                <Common />
              </Store.Provider>
            </ApolloProvider>
          </I18nextProvider>
        </React.StrictMode>
      </BrowserRouter>
    </CookiesProvider>
  );
};

export default Providers;
