import { Button, Group, Text, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';

interface Props {
  title: string;
  description?: string;
  backBtn?: boolean;
  fallbackPath?: string;
  rightSection?: ReactNode;
}

export const PageTop = ({
  title,
  description,
  backBtn = false,
  fallbackPath = ROUTES.root,
  rightSection,
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () =>
    location.key === 'default' ? navigate(fallbackPath) : navigate(-1);

  return (
    <div>
      {backBtn && (
        <Button
          variant="subtle"
          color="gray"
          size="compact-sm"
          leftSection={<IconArrowLeft size={16} />}
          mb="xs"
          onClick={handleBack}
        >
          Back
        </Button>
      )}
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2} fz={22}>
            {title}
          </Title>
          {description && <Text c="dimmed">{description}</Text>}
        </div>
        {rightSection}
      </Group>
    </div>
  );
};
