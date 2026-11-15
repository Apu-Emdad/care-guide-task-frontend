import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import type { ReactNode } from 'react';
import { cssVariablesResolver, theme } from '@/theme/theme';

/** Mantine keeps the light/dark choice in localStorage by itself. */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={cssVariablesResolver}
      defaultColorScheme="auto"
    >
      {/* Bottom right, so toasts never cover the header's user menu. */}
      <Notifications position="bottom-right" />
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  );
};
