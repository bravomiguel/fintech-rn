import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';
import RoundBtn from '@/components/roundBtn';
import Dropdown from '@/components/dropdown';
import { useBalanceStore } from '@/store/balanceStore';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import WidgetList from '@/components/sortableList/widgetList';
import { useHeaderHeight } from '@react-navigation/elements';

const Page = () => {
  const { balance, runTransaction, transactions, clearTransactions } =
    useBalanceStore();

  const headerHeight = useHeaderHeight();

  // console.log({ transactions });

  const onAddMoney = () => {
    const newTransaction = {
      id: Math.random().toString(),
      amount: Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1),
      date: new Date(),
      title: 'Added money',
    };
    // console.log({newTransaction});
    runTransaction(newTransaction);
  };

  return (
    <ScrollView style={{ backgroundColor: Colors.background }} contentContainerStyle={{paddingTop: headerHeight}}>
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{balance()}</Text>
          <Text style={styles.currency}>$</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <RoundBtn icon={'add'} text="Add money" onPress={onAddMoney} />
        <RoundBtn
          icon={'refresh'}
          text="Exchange"
          onPress={clearTransactions}
        />
        <RoundBtn icon={'list'} text="Details" />
        <Dropdown />
      </View>

      <Text style={defaultStyles.sectionHeader}>Transactions</Text>
      <View style={styles.transactions}>
        {transactions.length === 0 && (
          <Text style={{ padding: 16, color: Colors.gray }}>
            No transactions yet
          </Text>
        )}
        {transactions
          .sort((a, b) => moment(b.date).diff(moment(a.date)))
          .map((transaction, index) => (
            <View
              key={index}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}
            >
              <View style={styles.circle}>
                <Ionicons
                  name={transaction.amount > 0 ? 'add' : 'remove'}
                  size={24}
                  color={Colors.dark}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600' }}>{transaction.title}</Text>
                <Text style={{ color: Colors.gray, fontSize: 12 }}>
                  {moment(transaction.date).format('MM/DD/YYYY, h:mm:ss A')}
                </Text>
              </View>
              <Text style={{ fontWeight: '600' }}>{transaction.amount}$</Text>
            </View>
          ))}
      </View>

      <Text style={defaultStyles.sectionHeader}>Widgets</Text>
      <WidgetList />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  account: {
    margin: 80,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 10,
  },
  balance: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  currency: {
    fontSize: 20,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  transactions: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    gap: 20,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Page;
