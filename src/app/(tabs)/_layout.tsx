import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';

import { BottomTabBar, TabBarButton } from '@/components/BottomTabBar';

export const unstable_settings = {
  initialRouteName: 'Storefront',
};

export default function TabsLayout() {
  return (
    <Tabs>
      <TabSlot />

      <TabList asChild>
        <BottomTabBar>
          <TabTrigger name="Storefront" href="/(tabs)/Storefront" asChild>
            <TabBarButton label="Vitrine" icon="hanger" iconSet="material-community" />
          </TabTrigger>

          <TabTrigger name="Closet" href="/(tabs)/Closet" asChild>
            <TabBarButton label="Closet" icon="wardrobe-outline" iconSet="material-community" />
          </TabTrigger>

          <TabTrigger name="Looks" href="/(tabs)/Looks" asChild>
            <TabBarButton label="Looks" icon="sparkles-outline" iconSet="ionicons" />
          </TabTrigger>
        </BottomTabBar>
      </TabList>
    </Tabs>
  );
}
