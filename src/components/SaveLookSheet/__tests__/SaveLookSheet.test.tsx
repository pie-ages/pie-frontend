import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';
import { Keyboard, Platform, StyleSheet, type KeyboardEvent } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import type { LookFormData } from '@/schemas/lookSchema';

import { SaveLookSheet } from '..';

jest.mock('@/global.css', () => ({}));

const BOTTOM_INSET = 34;
const KEYBOARD_HEIGHT = 300;

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: BOTTOM_INSET },
};

type Listener = (event: KeyboardEvent) => void;
let listeners: Record<string, Listener>;
let removeListener: jest.Mock;

function Harness({ visible }: { visible: boolean }) {
  const { control } = useForm<LookFormData>({
    defaultValues: { title: '', occasion: '', items: [] },
  });
  return (
    <SafeAreaProvider initialMetrics={metrics}>
      <SaveLookSheet
        visible={visible}
        control={control}
        imageUri={null}
        error={null}
        saving={false}
        onPickImage={jest.fn()}
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />
    </SafeAreaProvider>
  );
}

const sheetStyle = () => StyleSheet.flatten(screen.getByTestId('save-look-sheet').props.style);

const emit = (event: string) =>
  act(async () =>
    listeners[event]?.({ endCoordinates: { height: KEYBOARD_HEIGHT } } as KeyboardEvent),
  );

describe('SaveLookSheet keyboard handling', () => {
  beforeEach(() => {
    listeners = {};
    removeListener = jest.fn();
    jest.spyOn(Keyboard, 'addListener').mockImplementation((event, callback) => {
      listeners[event] = callback as Listener;
      return { remove: removeListener } as unknown as ReturnType<typeof Keyboard.addListener>;
    });
  });

  describe('on Android', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'android');
    });

    it('does not push the sheet up when the keyboard opens', async () => {
      await render(<Harness visible />);
      await emit('keyboardDidShow');

      expect(sheetStyle().marginBottom).toBe(0);
    });

    it('restores the bottom inset padding when the keyboard closes', async () => {
      await render(<Harness visible />);
      await emit('keyboardDidShow');
      await emit('keyboardDidHide');

      expect(sheetStyle()).toMatchObject({ marginBottom: 0, paddingBottom: BOTTOM_INSET + 16 });
    });

    it('keeps the same behavior after closing and reopening the sheet', async () => {
      await render(<Harness visible />);
      await screen.rerender(<Harness visible={false} />);
      await screen.rerender(<Harness visible />);
      await emit('keyboardDidShow');

      expect(sheetStyle().marginBottom).toBe(0);
      expect(screen.getByLabelText('Avançar para foto do look')).toBeTruthy();
    });

    it('lets the user type the look name while the keyboard is open', async () => {
      await render(<Harness visible />);
      await emit('keyboardDidShow');
      await fireEvent.changeText(screen.getByLabelText('Nome do look'), 'Ir para faculdade');

      expect(screen.getByLabelText('Nome do look').props.value).toBe('Ir para faculdade');
    });
  });

  describe('on iOS', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'ios');
    });

    it('lifts the sheet above the keyboard and drops it when the keyboard hides', async () => {
      await render(<Harness visible />);
      await emit('keyboardWillShow');
      expect(sheetStyle()).toMatchObject({ marginBottom: KEYBOARD_HEIGHT, paddingBottom: 16 });

      await emit('keyboardWillHide');
      expect(sheetStyle()).toMatchObject({ marginBottom: 0, paddingBottom: BOTTOM_INSET + 16 });
    });
  });

  it('removes the keyboard listeners on unmount', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');
    await render(<Harness visible />);
    await screen.unmount();

    expect(removeListener).toHaveBeenCalledTimes(2);
  });
});
