import { useMemo } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

export const USER_LOGOUT = gql`
  mutation userLogout {
    node: userLogout(input: {}) {
      success
    }
  }
`;

export const useUserLogout = () => {
  const [userLogout, { data: dataUser }] = useMutation(USER_LOGOUT);
  const logout = useMemo(() => dataUser?.node, [dataUser]);

  const handleLogout = () => {
    userLogout();
  };

  return { logout, handleLogout };
};
