import { useLocalSearchParams } from 'expo-router';

import { ProductDetailsScreen } from '@/features/auth/screens/product-details-screen';

export default function ProductDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ProductDetailsScreen id={id} />;
}
