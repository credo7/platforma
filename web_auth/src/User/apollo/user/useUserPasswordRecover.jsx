import { useMemo } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

export const USER_PASSWORD_RECOVER = gql`
  mutation userPasswordRecover(
    $email: String!
    $code: String!
    $newPassword: String!
  ) {
    node: userPasswordRecover(
      input: { email: $email, code: $code, newPassword: $newPassword }
    ) {
      success
    }
  }
`;

export const useUserPasswordRecover = ({ credential }) => {
  const [userPasswordRecover, { data: dataPasswordRecover }] = useMutation(
    USER_PASSWORD_RECOVER
  );
  const isPasswordRecover = useMemo(
    () => dataPasswordRecover?.node?.success,
    [dataPasswordRecover]
  );

  const handlePasswordRecover = (data) => {
    credential &&
      userPasswordRecover({
        variables: { ...credential, newPassword: data.newPassword },
      });
  };

  return { isPasswordRecover, handlePasswordRecover };
};
