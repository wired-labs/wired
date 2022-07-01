import { createContext, useContext, useEffect, useState } from "react";
import { Client, Provider, createClient } from "urql";

import { EthersContext } from "@wired-xr/ethers";

import { API_URL, LocalStorage } from "./constants";

const defaultClient = createClient({ url: API_URL });

export interface IClientContext {
  client: Client;
}

export const initialClientContext: IClientContext = { client: defaultClient };

export const ClientContext =
  createContext<IClientContext>(initialClientContext);

interface Props {
  children: React.ReactNode;
}

export function ClientProvider({ children }: Props) {
  const [client, setClient] = useState<Client>(defaultClient);

  const { address } = useContext(EthersContext);

  useEffect(() => {
    if (!address) {
      setClient(defaultClient);
      return;
    }

    function getAccessToken() {
      if (!address) return;

      const accessToken = localStorage.getItem(
        `${address}${LocalStorage.AccessToken}`
      );

      return accessToken;
    }

    const client = createClient({
      url: API_URL,
      fetchOptions: () => {
        const token = getAccessToken();

        return {
          headers: { authorization: token ? `Bearer ${token}` : "" },
        };
      },
    });

    setClient(client);
  }, [address]);

  return (
    <Provider value={client}>
      <ClientContext.Provider
        value={{
          client,
        }}
      >
        {children}
      </ClientContext.Provider>
    </Provider>
  );
}
