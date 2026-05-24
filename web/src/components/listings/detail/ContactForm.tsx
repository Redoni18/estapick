'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Real submission, validation, and rate limiting are out of scope per the
  // task brief; this flips to a confirmation panel so the UX is still complete.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
  }

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div>
        <h3 className="font-bold text-sm text-foreground">Interested in this Property?</h3>
        <p className="text-2xs text-subtle mt-0.5">
          Send a message directly to our listing coordinator.
        </p>
      </div>

      {isSubmitted ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-700/40 dark:bg-emerald-950/20"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
              Inquiry received
            </p>
            <p className="text-2xs text-muted">
              Our listing coordinator will reach out shortly.
            </p>
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="text-2xs text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200 underline underline-offset-2"
            >
              Send another message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input type="text" required placeholder="Full Name" aria-label="Full name" />
          <Input type="email" required placeholder="Email Address" aria-label="Email address" />
          <textarea
            rows={3}
            required
            aria-label="Message"
            placeholder="Hello, I am interested in viewing this property. Please contact me with more information."
            className="w-full bg-surface-1 border border-surface-3 rounded-lg px-3 py-2 text-xs text-foreground placeholder-subtle focus:outline-none focus:border-brand transition resize-none"
          />
          <Button type="submit" className="w-full">
            Send Inquiry
          </Button>
        </form>
      )}
    </div>
  );
}
