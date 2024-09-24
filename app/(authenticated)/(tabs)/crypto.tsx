import { View, Text, Image } from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';

const Page = () => {
  const currencies = useQuery({
    queryKey: ['listings'],
    queryFn: () => fetch('/api/listings').then((res) => res.json()),
  });
  // console.log({currencyData: currencies.data})

  const ids = currencies.data
    ?.map((currency: Currency) => currency.id)
    .join(',');
  // console.log({ids});

  const { data } = useQuery({
    queryKey: ['info'],
    queryFn: () => fetch(`/api/info?ids=${ids}`).then((res) => res.json()),
    enabled: !!ids,
  });
  // console.log({data});

  return (
    <View>
      {currencies.data?.map((currency: Currency) => (
        <View style={{ flexDirection: 'row' }} key={currency.id}>
          <Image
            source={{ uri: data?.[currency.id]?.logo }}
            style={{ width: 32, height: 32 }}
          />
          <Text>{currency.name}</Text>
        </View>
      ))}
    </View>
  );
};

export default Page;
