import { usePlaidLink } from 'react-plaid-link';
import { useEffect, useState } from 'react';
import { usePlaidStore } from '../../stores/plaidStore';
import { useTransactionStore } from '../../stores/transactionStore';

interface PlaidLinkButtonProps {
  userId: string | undefined;
}

export const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({ userId }) => {
  const [linkToken, setLinkToken] = useState(null);
  const setInstitutions = usePlaidStore((state) => state.setInstitutions);
  const setAccounts = usePlaidStore((state) => state.setAccounts);

  useEffect(() => {
    console.log(userId);
    const createLinkToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plaid/create_link_token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });
    
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to create link token', errorData);
          return;
        }
    
        const data = await response.json();
        console.log('Link Token Response:', data);
        setLinkToken(data.link_token);
      } catch (error) {
        console.error('Error creating link token:', error);
      }
    };
    createLinkToken();
  }, [userId]);

  const onSuccess = async (public_token: string) => {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plaid/exchange_public_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_token,
        user_id: userId,
      }),
    });

    const accountsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/plaid/fetch_accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    });

    const accountsData = await accountsResponse.json();
    console.log('Accounts data:', accountsData);
    setInstitutions(accountsData.institutions);
    setAccounts(accountsData.accounts);

    const fetchTransactions = useTransactionStore((state) => state.fetchAllTransactions);
    await fetchTransactions(userId);
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

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="p-2 hover:cursor-pointer hover:bg-muted rounded-lg"
    >
      Connect Bank
    </button>
  );
};
