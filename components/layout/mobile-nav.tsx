"use client";

import Link from "next/link";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";

interface Props {
  items: ReadonlyArray<{ href: string; label: string }>;
}

export function MobileNav({ items }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" aria-label="Open menu" className="inline-flex size-10 items-center justify-center rounded-md border bg-card hover:bg-muted md:hidden">
          <Menu className="size-5" aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 md:hidden" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col gap-2 border-l bg-background p-4 shadow-xl md:hidden">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">Menu</Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" aria-label="Close menu" className="inline-flex size-10 items-center justify-center rounded-md hover:bg-muted">
                <X className="size-5" aria-hidden />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Site navigation</Dialog.Description>
          <nav aria-label="Mobile" className="mt-2 flex flex-col">
            {items.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-3 text-base font-medium hover:bg-muted">
                {item.label}
              </Link>
            ))}
            <Link href="/#converter" onClick={() => setOpen(false)} className="mt-3 inline-flex h-11 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground">
              Convert Image
            </Link>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
