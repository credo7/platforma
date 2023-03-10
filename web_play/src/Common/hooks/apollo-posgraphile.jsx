import { useEffect, useMemo } from "react";
import { gql, useLazyQuery, useQuery, useMutation } from "@apollo/client";

const getFragmentInfo = (fragment, options = {}) => {
  
  return { name }
}

const getQueries = (fragment, options = {}) => {
  const {  }

  return {
    READ: gql`
      query read($condition: ${Name}Condition, $filter: ${Name}Filter) {
        read: all${Name}s(condition: $condition, filter: $filter) {
          nodes {
            id, ${columns}
          }
          totalCount
        }
      }
    `,
    CREATE: gql`
      mutation create($input: Create${Name}Input!) {
        create: create${Name}(input: $input) {
          clientMutationId
          node: ${name} {
            id, ${columns}
          }
        }
      }
    `,
    UPDATE: gql`
      mutation update($input: Update${Name}ByIdInput!) {
        update: update${Name}ById(input: $input) {
          clientMutationId
          node: ${name} {
            id, ${columns}
          }
        }
      }
    `,
    DELETE: gql`
      mutation delete($input: Delete${Name}ByIdInput!) {
        delete: delete${Name}ById(input: $input) {
          clientMutationId
          node: ${name} {
            id, ${columns}
          }
        }
      }
    `,
  };
};


export const useGet = ({ fragment, variables = {}, condition = true }) => {
  const [get, { data }] = useLazyQuery(GET_USERS_SOCIAL);

  const result = useMemo(() => data?.node, [data]);

  useEffect(() => {
    condition && get({ variables });
  }, [userId, get]);

  return { data };
};

export const useCreate = () => {
  const [create, { data }] = useMutation(CREATE_USERS_SOCIAL);

  const created = useMemo(() => data?.node, [data]);

  return { create, created };
};

export const useUpdate = () => {
  const [update, { data }] = useMutation(UPDATE_USERS_SOCIAL);

  const updated = useMemo(() => data?.node, [data]);

  return { update, updated };
};

export const useMerge = () => {
  const { create, created } = useCreate();
  const { update, updated } = useUpdate();

  const merge = ({ userId, , new }) => {
    ! &&
      create({
        variables: { : { userId, ...new } },
      });

     &&
      update({
        variables: { userId, : { ...new } },
      });
  };

  const merged = useMemo(
    () => created || updated,
    [created, updated]
  );

  return { merge, merged };
};
