'use client';

import { AI, Product } from '@/app/action';
import { Button } from '../ui/button';
import { useId, useState } from 'react';
import { useAIState } from 'ai/rsc';
import { sleep } from '@/lib/utils';

enum PaymentStatus {
  Idle,
  Pending,
  Success,
  Failed,
}

enum Views {
  EnterOtp,
  Success,
  Failed,
}

export function Checkout({ product }: { product: Product }) {
  const [history, setHistory] = useAIState<typeof AI>();

  const [view, setView] = useState(Views.EnterOtp);
  const [status, setStatus] = useState(PaymentStatus.Idle);
  const [otp, setOtp] = useState('');

  const id = useId();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus(PaymentStatus.Pending);

    if (otp.length !== 6) {
      return;
    }

    try {
      await sleep(2000);

      if (Math.random() > 0.8) {
        throw new Error('Payment failed');
      }

      const info = {
        role: 'system' as const,
        content: `[User has successfully purchased ${product.name} with id ${product.id}]`,
        id,
      };

      if (history[history.length - 1]?.id === id) {
        setHistory([...history.slice(0, -1), info]);
      } else {
        setHistory([...history, info]);
      }

      setStatus(PaymentStatus.Success);
      setView(Views.Success);
    } catch (error) {
      const info = {
        role: 'system' as const,
        content: `[User has failed to purchase ${product.name} with id ${product.id}]`,
        id,
      };

      if (history[history.length - 1]?.id === id) {
        setHistory([...history.slice(0, -1), info]);
        return;
      } else {
        setHistory([...history, info]);
      }

      setStatus(PaymentStatus.Failed);
      setView(Views.Failed);
    }
  };

  return (
    <div>
      <h1 className="font-bold text-2xl">Checkout</h1>
      <hr className="my-4" />
      <div className="flex flex-row gap-4 align-middle justify-between">
        <h2 className="font-bold text-xl block">{product.name}</h2>
        {/* format price */}
        <span>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(product.price)}
        </span>
      </div>

      {view === Views.EnterOtp && (
        <div className="p-4 border-slate-300/20 border-2 rounded-md bg-slate-100/5 my-6 flex flex-col sm:flex-row gap-4 align-middle justify-center">
          <div>
            <strong className="text-center">
              Complete your payment by entering the OTP sent to your phone
            </strong>

            <p>
              An OTP has been sent to your phone number ending in{' '}
              <strong>**** 1234</strong>
            </p>
          </div>
          <form
            onSubmit={submit}
            className="my-4 flex flex-col align-middle justify-center gap-4"
          >
            <div className="flex flex-row align-middle justify-center">
              {/* <OTPInput
                maxLength={6}
                containerClassName="group flex items-center has-[:disabled]:opacity-30 align-middle w-content"
                onChange={(value) => {
                  setOtp(value);
                }}
                render={({ slots }) => (
                  <>
                    <div className="flex">
                      {slots.slice(0, 3).map((slot, idx) => (
                        <Slot key={idx} {...slot} />
                      ))}
                    </div>

                    <FakeDash />

                    <div className="flex">
                      {slots.slice(3).map((slot, idx) => (
                        <Slot key={idx} {...slot} />
                      ))}
                    </div>
                  </>
                )}
              /> */}
            </div>

            <Button
              variant={'default'}
              disabled={
                [PaymentStatus.Pending, PaymentStatus.Success].includes(
                  status,
                ) || otp.length !== 6
              }
            >
              {status === PaymentStatus.Pending
                ? 'Processing...'
                : status === PaymentStatus.Success
                  ? 'Payment successful'
                  : status === PaymentStatus.Failed
                    ? 'Payment failed'
                    : 'Complete payment'}
            </Button>
          </form>
        </div>
      )}

      {view === Views.Success && (
        <div className="p-4 border-emerald-300/20 border-2 rounded-md bg-emerald-100/5 my-6">
          <h2 className="font-bold text-xl">Payment successful</h2>

          <p className="mt-2">
            Your payment has been successfully processed. You will receive a
            confirmation email shortly.
          </p>
        </div>
      )}

      {view === Views.Failed && (
        <div className="text-red-500">
          Payment failed
          <Button
            variant={'default'}
            onClick={() => {
              setView(Views.EnterOtp);
              setStatus(PaymentStatus.Idle);
            }}
          >
            Retry payment
          </Button>
        </div>
      )}
    </div>
  );
}

// function Slot(props: SlotProps) {
//   return (
//     <div
//       className={cn(
//         'relative w-10 h-14 text-[2rem]',
//         'flex items-center justify-center',
//         'transition-all duration-300',
//         'border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md',
//         'group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20',
//         'outline outline-0 outline-accent-foreground/20',
//         { 'outline-4 outline-accent-foreground': props.isActive },
//       )}
//     >
//       {props.char !== null && <div>{props.char}</div>}
//       {props.hasFakeCaret && <FakeCaret />}
//     </div>
//   );
// }

// function FakeCaret() {
//   return (
//     <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
//       <div className="w-px h-8 bg-white" />
//     </div>
//   );
// }

// function FakeDash() {
//   return (
//     <div className="flex w-10 justify-center items-center">
//       <div className="w-3 h-1 rounded-full bg-border" />
//     </div>
//   );
// }
