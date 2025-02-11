import { OrderedList } from './Lists';

function AccountTracker({ accounts, setRefreshCallback }){
  const shallowCopy = accounts.slice();
  const items = shallowCopy.map((acc) => {
    return { id: acc.addr, value: acc}
  });

  function accountTextFormatter(account){
    let accountId = account.name === '' ? account.addr : account.name;
    let transactionPending = account.transaction_ongoing ? 'Has transactions pending' : 'No transactions pending';
    return `${accountId} (${account.amount} TGK) (${transactionPending})`;
  }

  setRefreshCallback();

  return (
    <OrderedList
      items={items}
      itemTextHandler={accountTextFormatter}
    />
  )
}

export { AccountTracker };
