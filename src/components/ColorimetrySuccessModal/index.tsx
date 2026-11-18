import { router, useLocalSearchParams } from 'expo-router';

import { SuccessModal } from '@/components/SuccessModal';
import { useFavoriteStyles } from '@/hooks/UseFavoriteStyles';
import { IDENTIFIED_STYLE_INFO } from '@/types/IdentifiedStyle';
import { ProfileStatus } from '@/types/Profile';

export function ColorimetrySuccessModal() {
  const { colorimetryUpdated } = useLocalSearchParams<{ colorimetryUpdated?: string }>();
  const visible = colorimetryUpdated === 'true';
  const { favoriteStyles, status } = useFavoriteStyles(visible);
  const styleNames =
    status === ProfileStatus.Success
      ? favoriteStyles.map((style) => IDENTIFIED_STYLE_INFO[style].label).join(', ')
      : '';

  return (
    <SuccessModal
      visible={visible}
      title="Colorimetria atualizada!"
      message={
        styleNames
          ? `${favoriteStyles.length === 1 ? 'Seu estilo' : 'Seus estilos'}: ${styleNames}`
          : undefined
      }
      buttonTitle="Continuar"
      onContinue={() => router.setParams({ colorimetryUpdated: undefined })}
    />
  );
}
