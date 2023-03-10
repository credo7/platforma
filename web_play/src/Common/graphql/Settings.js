import { gql } from "@apollo/client";

export const GET_SETTING = gql`
  query getSetting($id: String!) {
    node: settingById(id: $id) {
      value
    }
  }
`;

export const GET_SETTINGS = gql`
  query getSettings {
    node: allSettings {
      nodes {
        id
        value
      }
    }
  }
`;
