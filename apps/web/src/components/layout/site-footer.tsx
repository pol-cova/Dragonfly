import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative z-20 mt-auto border-t border-[var(--border)]">
      <div className="mx-auto max-w-5xl px-4 py-3 font-mono text-xs text-[var(--fg-dim)] md:px-6">
        built by{" "}
        <a
          href={site.creator.url}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--fg)] hover:text-[var(--fg-bright)]"
        >
          {site.creator.name}
        </a>
        {" · "}
        <a
          href={site.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="hover:text-[var(--fg-bright)]"
        >
          github
        </a>
        {" · "}
        {site.license}
      </div>
    </footer>
  );
}
