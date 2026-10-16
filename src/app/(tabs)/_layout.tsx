import { BlurTargetView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomTabBar, TabBarButton } from '@/components/BottomTabBar';
import { OnboardingOverlay } from '@/components/OnboardingOverlay';

export const unstable_settings = {
  initialRouteName: 'Storefront',
};

export default function TabsLayout() {
  const blurTargetRef = useRef<View | null>(null);
  const router = useRouter();
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(true);

  return (
    <Tabs>
      <BlurTargetView ref={blurTargetRef} style={styles.blurTarget}>
        <TabSlot />
      </BlurTargetView>

      <TabList asChild>
        <BottomTabBar>
          <TabTrigger name="Storefront" href="/Storefront" asChild>
            <TabBarButton label="Vitrine" icon="hanger" iconSet="material-community" />
          </TabTrigger>

          <TabTrigger name="Closet" href="/Closet" asChild>
            <TabBarButton label="Closet" icon="wardrobe-outline" iconSet="material-community" />
          </TabTrigger>

          <TabTrigger name="Looks" href="/Looks" asChild>
            <TabBarButton label="Looks" icon="sparkles-outline" iconSet="ionicons" />
          </TabTrigger>
        </BottomTabBar>
      </TabList>

      {isOnboardingVisible && (
        <OnboardingOverlay
          blurTarget={blurTargetRef}
          onSkip={() => {
            setIsOnboardingVisible(false);
            router.replace('/Storefront');
          }}
        />
      )}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  blurTarget: {
    flex: 1,
  },
});
