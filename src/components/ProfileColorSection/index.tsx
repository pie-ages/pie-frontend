import { ColorimetryColorRow } from '@/components/ColorimetryColorRow';
import { ProfileSectionCard } from '@/components/ProfileSectionCard';
import { ProfileSectionStatus } from '@/components/ProfileSectionStatus';
import { ProfileStatus } from '@/types/Profile';

type ProfileColorSectionProps = {
  title: string;
  caption?: string;
  status: ProfileStatus;
  colors: string[];
  errorTitle: string;
  emptyTitle: string;
  onRetry: () => void;
};

export function ProfileColorSection({
  title,
  caption,
  status,
  colors,
  errorTitle,
  emptyTitle,
  onRetry,
}: ProfileColorSectionProps) {
  if (status === ProfileStatus.Success && colors.length > 0) {
    return <ColorimetryColorRow compact title={title} colors={colors} caption={caption} />;
  }

  const sectionStatus = status === ProfileStatus.Success ? ProfileStatus.Empty : status;

  return (
    <ProfileSectionCard title={title}>
      <ProfileSectionStatus
        status={sectionStatus}
        errorTitle={errorTitle}
        emptyTitle={emptyTitle}
        onRetry={onRetry}
      />
    </ProfileSectionCard>
  );
}
