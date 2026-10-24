// import { Redirect } from 'expo-router';

// import { useAuth } from '@/contexts/AuthContext';

// export default function Index() {
//   const { isAuthenticated } = useAuth();

//   return <Redirect href={isAuthenticated ? '/Storefront' : '/Login'} />;
// }

import MyStyleScreen from '@/app/(screens)/MyStyle/index';

export default function Index() {
  return <MyStyleScreen />;
}
