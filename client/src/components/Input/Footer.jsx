import { useRecoilValue } from 'recoil';
import store from '~/store';
import countTokens from '~/utils/countTokens.js';
import { useGetAccountsInfoQuery } from '~/data-provider';
import { useAuthContext } from '~/hooks/AuthContext';
import { useState, useEffect } from 'react';

export default function Footer({ text }) {
  const currentConversation = useRecoilValue(store.conversation) || {};
  const { getToken } = store.useToken(currentConversation?.endpoint);
  const token = getToken();
  const { token: AuthToken } = useAuthContext();
  const accounts = useGetAccountsInfoQuery({ enabled: !!AuthToken });
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (accounts && accounts.data && accounts.data.account) {
      setAccount(accounts.data.account);
    }
    else {
      setAccount(null);
    }
  }, [accounts]);

  const counted = countTokens(text);
  if (token) {
    return (
      <div className="text-md hidden px-3 pb-1 pt-2 text-center text-black/50 dark:text-white/50 md:block md:px-4 md:pb-4 md:pt-3">
        You are using your own api token
      </div>
    );
  }

  if (account) {
    return (
      <>
        <div className="text-md hidden px-3 pb-1 pt-2 text-center text-black/50 dark:text-white/50 md:block md:px-4 md:pb-4 md:pt-3">
          <br />
          You are using Premium Account, Have Fun.<br />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="text-md hidden px-3 pb-1 pt-2 text-center text-black/50 dark:text-white/50 md:block md:px-4 md:pb-4 md:pt-3">
        <span className={counted.length < 500 ? 'text-green-600' : 'text-red-600'}>{counted.length}/500</span>
        <br />
        You are using free and limited api token <br />( 5 question per day and maximum 500 token for each
        question )
      </div>
    </>
  );
}
