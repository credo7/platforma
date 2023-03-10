import { useEffect, useMemo } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";

import {
  GET_USERS_SOCIAL,
  CREATE_USERS_SOCIAL,
  UPDATE_USERS_SOCIAL,
} from "Common/graphql/UsersSocials";

export const useGetUsersSocial = ({ userId }) => {
  const [getUsersSocial, { data }] = useLazyQuery(GET_USERS_SOCIAL);

  const usersSocial = useMemo(() => data?.node, [data]);

  useEffect(() => {
    userId && getUsersSocial({ variables: { userId } });
  }, [userId, getUsersSocial]);

  return { usersSocial };
};

export const useCreateUsersSocial = () => {
  const [createUsersSocial, { data }] = useMutation(CREATE_USERS_SOCIAL);

  const createdUsersSocial = useMemo(() => data?.node, [data]);

  return { createUsersSocial, createdUsersSocial };
};

export const useUpdateUsersSocial = () => {
  const [updateUsersSocial, { data }] = useMutation(UPDATE_USERS_SOCIAL);

  const updatedUsersSocial = useMemo(() => data?.node, [data]);

  return { updateUsersSocial, updatedUsersSocial };
};

export const useMergeUsersSocial = () => {
  const { createUsersSocial, createdUsersSocial } = useCreateUsersSocial();
  const { updateUsersSocial, updatedUsersSocial } = useUpdateUsersSocial();

  const mergeUsersSocial = ({ userId, usersSocial, newUsersSocial }) => {
    !usersSocial &&
      createUsersSocial({
        variables: { usersSocial: { userId, ...newUsersSocial } },
      });

    usersSocial &&
      updateUsersSocial({
        variables: { userId, usersSocial: { ...newUsersSocial } },
      });
  };

  const mergedUsersSocial = useMemo(
    () => createdUsersSocial || updatedUsersSocial,
    [createdUsersSocial, updatedUsersSocial]
  );

  return { mergeUsersSocial, mergedUsersSocial };
};
