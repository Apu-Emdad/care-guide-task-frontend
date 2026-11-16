import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';
import { cssVariablesResolver, theme } from '@/theme/theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={cssVariablesResolver}
      defaultColorScheme="auto"
    >
      <Notifications position="bottom-right" />
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
};
