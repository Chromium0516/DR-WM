import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Props = {
  src: string;
  alt: string;
  title: string;
  caption?: ReactNode;
  className?: string;
  priority?: boolean;
};

export function FigureModal({ src, alt, title, caption, className, priority }: Props) {
  return (
    <figure className={className}>
      <Dialog>
        <DialogTrigger asChild>
          <button type="button" aria-label={`Enlarge figure: ${title}`} className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-border-strong">
            <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" className="h-auto w-full" />
          </button>
        </DialogTrigger>
        <DialogContent className="figure-dialog flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-6xl flex-col gap-0 overflow-hidden rounded-xl p-0">
          <DialogHeader className="shrink-0 border-b border-border px-5 py-5 pr-16 text-left">
            <DialogTitle className="text-base leading-snug">{title}</DialogTitle>
            <DialogDescription className="sr-only">{alt}</DialogDescription>
          </DialogHeader>
          <div className="min-h-0 overflow-auto bg-surface p-3 sm:p-6">
            <img src={src} alt={alt} className="mx-auto h-auto w-full" />
          </div>
        </DialogContent>
      </Dialog>
      {caption ? <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">{caption}</figcaption> : null}
    </figure>
  );
}
