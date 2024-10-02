import { usePlaidLink } from 'react-plaid-link';
import { useEffect, useState } from 'react';
import { usePlaidStore } from '../../stores/plaidStore'

interface PlaidLinkButtonProps {
    userId: string;
    }

export const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({ userId }) => {
  const [linkToken, setLinkToken] = useState(null);
  const setInstitutions = usePlaidStore((state) => state.setInstitutions);
  const setAccounts = usePlaidStore((state) => state.setAccounts);

  useEffect(() => {
    console.log(userId);
    const createLinkToken = async () => {
      const response = await fetch('/api/plaid/create_link_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await response.json();
      setLinkToken(data.link_token);
    };
    createLinkToken();
  }, [userId]);

  const onSuccess = async (public_token: string) => {
    await fetch('/api/plaid/exchange_public_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_token,
        user_id: userId,
      }),
    });

    const accountsResponse = await fetch('/api/plaid/fetch_accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });
  
      const accountsData = await accountsResponse.json();
  
      setInstitutions(accountsData.institutions);
      setAccounts(accountsData.accounts);
    };
  
    const config = {
      token: linkToken,
      onSuccess,
    };
  
    const { open, ready } = usePlaidLink({
      token: linkToken,
      onSuccess,
    });
  
    if (!linkToken) {
      return <div>Loading...</div>;
    }
  
    return <button onClick={() => open()} disabled={!ready}>Connect Bank</button>;
  };