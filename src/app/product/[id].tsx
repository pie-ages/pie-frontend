import { useLocalSearchParams } from 'expo-router';

import { ProductDetailsScreen } from '@/app/screens/ProductDetails';

export default function ProductDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ProductDetailsScreen id={id} />;
}
