import { gql } from "@apollo/client";

export const GET_ENUM = gql`
  query getEnum($name: String) {
    node: getEnum(input: { _typname: $name }) {
      names
    }
  }
`;
