import { gql } from "@apollo/client";

function ucFirst(str) {
  // только пустая строка в логическом контексте даст false
  if (!str) return str;

  return str[0].toUpperCase() + str.slice(1);
}

export const crud = (name, columns = "") => {
  const Name = ucFirst(name);
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
