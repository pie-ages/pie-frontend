import { useLocalSearchParams } from 'expo-router';

import { ProductDetailsScreen } from '@/features/auth/screens/ProductDetails';

export default function ProductDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ProductDetailsScreen id={id} />;
}
