'use client';

import React from 'react';

import { cn } from '@/lib/utils';
import { AI } from '@/app/action';
import { useUIState, useActions } from 'ai/rsc';

const commans = ['Show products'];

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  const [, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  const handleCommand = async (command: string) => {
    const response = await submitUserMessage(command);
    setMessages((currentMessages) => [...currentMessages, response]);
  };

  return (
    <>
      <p
        className={cn(
          'px-2 text-center text-xs leading-normal text-muted-foreground',
          className,
        )}
        {...props}
      >
        Suggested commands:{' '}
        {commans.map((command, i) => (
          <span
            key={command}
            className="text-blue-500 hover:underline padding-4 cursor-pointer"
            onClick={() => handleCommand(command)}
          >
            {i === 0 ? '' : ', '}
            {command}
          </span>
        ))}
      </p>
    </>
  );
}
