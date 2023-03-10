import PrivateRoute from "Common/components/Routes/PrivateRoute";

import Home from "Wallets/pages/Home";
import Profile from "Wallets/pages/Profile";
import Withdraw from "Wallets/pages/Withdraw";
import Deposit from "Wallets/pages/Deposit";
import Transactions from "Wallets/pages/Transactions";

const Pages = () => {
  return (
    <>
      <PrivateRoute exact path="/wallets" component={Home} />
      <PrivateRoute path="/wallets/profile" component={Profile} />
      <PrivateRoute path="/wallets/withdraw" component={Withdraw} />
      <PrivateRoute path="/wallets/deposit" component={Deposit} />
      <PrivateRoute
        exact
        path="/wallets/transactions/:type?"
        component={Transactions}
      />
    </>
  );
};

export default Pages;
