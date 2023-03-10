import { useMemo } from "react";
import { useQuery } from "@apollo/client";

import { GET_SOCIALS } from "Common/graphql/Socials";

export const useGetSocials = () => {
  const { data } = useQuery(GET_SOCIALS);

  const socials = useMemo(() => data?.node?.nodes, [data]);

  return { socials };
};
