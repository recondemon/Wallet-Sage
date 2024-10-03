import { useEffect, useState } from "react";
import { Account } from "../../../../lib/types/AccountTypes";

//! TODO: Add type safety, adjust styling, and add expandable logic to AccountsList component

interface AccountListProps {
    accounts: Account[];
    }

interface GroupedAccounts {
  [institution_name: string]: Account[];
  }

const AccountsList: React.FC<AccountListProps> = ({ accounts }) => {
  const [groupedAccounts, setGroupedAccounts] = useState<GroupedAccounts>({});

  useEffect(() => {
    const grouped = accounts.reduce<GroupedAccounts>((result, account) => {
      if (!result[account.institution_name]) {
        result[account.institution_name] = [];
      }
      result[account.institution_name].push(account);
      return result;
    }, {});
    
    setGroupedAccounts(grouped);
  }, [accounts]);

  return (
    <div>
      {/*//! TODO: Create Drop Downs for each institution -> list ALL accounts linked by that institution when expanded, add total balance per institution to right of institution name */}
      {Object.keys(groupedAccounts).map((institution_name) => (
        <div key={institution_name} style={{ marginBottom: '20px' }}>
          <h2 className="text-1vw font-semi-bold mt-2">{institution_name}</h2>
          <ul>
            {/*//! TODO: add expanded / not expanded logic */}
            {groupedAccounts[institution_name].map((account) => (
              <li key={account.account_id}>
                <div className="grid grid-cols-3 w-full">
                  <p className="col-span-1 w-full text-left">
                    {account.name}
                  </p>
                  <p className="col-span-1 w-full text-center">
                    {account.type}
                  </p>
                  <p className="col-span-1 w-full text-right">
                    ${account.balance}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AccountsList;
