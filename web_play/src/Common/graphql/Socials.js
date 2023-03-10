import { gql } from "@apollo/client";

export const GET_SOCIALS = gql`
  query getSocials {
    node: allSocials {
      nodes {
        field
        url
      }
    }
  }
`;
