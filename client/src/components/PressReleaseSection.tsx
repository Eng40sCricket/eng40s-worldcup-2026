// DESIGN: "Stadium Broadcast" — Formal press release section
// Media-grade layout with structured blocks, quote styling,
// copy-to-clipboard, print-friendly view, and PDF-ready export
import { useRef, useCallback } from 'react';
import {
  pressReleaseData,
  type PressRelease,
  type PressReleaseBlock,
} from '@/lib/data';
import { motion } from 'framer-motion';
import {
  FileText,
  Calendar,
  Copy,
  Printer,
  FileDown,
  Shield,
  Quote,
  Mail,
  Phone,
  User,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

// ---- HELPERS ----

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Converts a press release into plain text for clipboard copying.
 */
function releaseToPlainText(pr: PressRelease): string {
  const lines: string[] = [];

  lines.push('PRESS RELEASE');
  lines.push('');
  if (pr.embargo) {
    lines.push(pr.embargo.toUpperCase());
    lines.push('');
  }
  lines.push(pr.title.toUpperCase());
  if (pr.subtitle) lines.push(pr.subtitle);
  lines.push('');
  lines.push(`Date: ${formatDate(pr.date)}`);
  if (pr.author) lines.push(`Issued by: ${pr.author}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const block of pr.blocks) {
    switch (block.type) {
      case 'paragraph':
        lines.push(block.text);
        lines.push('');
        break;
      case 'quote':
        lines.push(`"${block.text}"`);
        if (block.attribution) lines.push(`— ${block.attribution}`);
        lines.push('');
        break;
      case 'subheading':
        lines.push(block.text.toUpperCase());
        lines.push('');
        break;
      case 'note':
        lines.push(`• ${block.text}`);
        lines.push('');
        break;
    }
  }

  if (pr.contacts && pr.contacts.length > 0) {
    lines.push('---');
    lines.push('');
    lines.push('MEDIA CONTACTS');
    lines.push('');
    for (const c of pr.contacts) {
      lines.push(c.name);
      if (c.role) lines.push(c.role);
      if (c.email) lines.push(`Email: ${c.email}`);
      if (c.phone) lines.push(`Phone: ${c.phone}`);
      lines.push('');
    }
  }

  lines.push('— ENDS —');
  return lines.join('\n');
}


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function PressReleaseSection() {
  return (
    <section id="press" aria-labelledby="press-heading" className="section-white py-16 sm:py-24">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="font-body text-sky text-sm tracking-[0.25em] uppercase mb-2 font-medium">
            Media Centre
          </p>
          <h2 id="press-heading" className="font-display text-navy text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase">
            Official Press Releases
          </h2>
          <div className="w-16 h-1 bg-sky mx-auto mt-3 rounded-full" />
        </motion.div>

        {pressReleaseData.releases.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-10">
            {pressReleaseData.releases.map((pr, i) => (
              <PressReleaseCard key={pr.id} release={pr} index={i} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center py-12"
          >
            <div className="w-20 h-20 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-5">
              <FileText className="w-10 h-10 text-navy/20" />
            </div>
            <h3 className="font-display text-navy text-xl font-semibold mb-2">
              No Press Releases Yet
            </h3>
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              Official press releases from England Over 40s Cricket will be published here.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}


// ============================================================
// PRESS RELEASE CARD
// ============================================================

function PressReleaseCard({ release, index }: { release: PressRelease; index: number }) {
  const printRef = useRef<HTMLDivElement>(null);

  // ---- COPY TO CLIPBOARD ----
  const handleCopy = useCallback(() => {
    const text = releaseToPlainText(release);
    navigator.clipboard.writeText(text).then(
      () => toast.success('Press release copied to clipboard'),
      () => toast.error('Failed to copy — please try again'),
    );
  }, [release]);

  // ---- PRINT ----
  const handlePrint = useCallback(() => {
    const el = printRef.current;
    if (!el) return;

    const printWindow = window.open('', '_blank', 'width=800,height=1000');
    if (!printWindow) {
      toast.error('Pop-up blocked — please allow pop-ups for printing');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${release.title} — England Over 40s Cricket</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Source Sans 3', Georgia, serif;
            color: #0A1628;
            max-width: 700px;
            margin: 40px auto;
            padding: 0 24px;
            line-height: 1.7;
            font-size: 14px;
          }
          .header { border-bottom: 2px solid #0A1628; padding-bottom: 16px; margin-bottom: 24px; }
          .org { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #666; margin-bottom: 4px; }
          .embargo { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #c00; font-weight: 700; margin-bottom: 12px; }
          h1 { font-size: 22px; font-weight: 700; line-height: 1.3; margin-bottom: 6px; }
          .subtitle { font-size: 15px; color: #444; font-style: italic; margin-bottom: 8px; }
          .meta { font-size: 12px; color: #888; }
          .body { margin-top: 20px; }
          .body p { margin-bottom: 14px; font-size: 14px; }
          .body blockquote {
            border-left: 3px solid #2196F3;
            padding: 12px 16px;
            margin: 20px 0;
            background: #f8f9fa;
            font-style: italic;
          }
          .body blockquote .attr { font-style: normal; font-size: 12px; color: #666; margin-top: 8px; }
          .body h3 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 24px 0 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
          .body .note { font-size: 13px; color: #555; padding-left: 16px; border-left: 2px solid #ddd; margin-bottom: 12px; }
          .contacts { border-top: 2px solid #0A1628; margin-top: 28px; padding-top: 16px; }
          .contacts h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
          .contact-item { margin-bottom: 12px; font-size: 13px; }
          .contact-item strong { display: block; }
          .contact-item span { color: #666; }
          .ends { text-align: center; margin-top: 32px; font-size: 12px; color: #888; letter-spacing: 2px; text-transform: uppercase; }
          @media print {
            body { margin: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="org">England Over 40s Cricket — Press Release</div>
          ${release.embargo ? `<div class="embargo">${release.embargo}</div>` : ''}
          <h1>${release.title}</h1>
          ${release.subtitle ? `<div class="subtitle">${release.subtitle}</div>` : ''}
          <div class="meta">${formatDate(release.date)}${release.author ? ` · ${release.author}` : ''}</div>
        </div>
        <div class="body">
          ${release.blocks.map((b) => blockToHtml(b)).join('\n')}
        </div>
        ${release.contacts && release.contacts.length > 0 ? `
          <div class="contacts">
            <h3>Media Contacts</h3>
            ${release.contacts.map((c) => `
              <div class="contact-item">
                <strong>${c.name}</strong>
                ${c.role ? `<span>${c.role}</span><br/>` : ''}
                ${c.email ? `<span>Email: ${c.email}</span><br/>` : ''}
                ${c.phone ? `<span>Phone: ${c.phone}</span>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        <div class="ends">— Ends —</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    // Small delay to let fonts load
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }, [release]);

  // ---- PDF-READY VIEW (same as print but stays open) ----
  const handlePdfView = useCallback(() => {
    handlePrint();
    toast.success('PDF-ready view opened — use your browser\'s "Save as PDF" option');
  }, [handlePrint]);

  return (
    <motion.article
      ref={printRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl border border-border shadow-sm overflow-hidden"
    >
      {/* Top accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-navy via-sky to-navy" />

      {/* Header area */}
      <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-border">
        {/* Organisation badge + embargo */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy/5 text-navy text-[11px] font-body font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-sky" />
            England Over 40s Cricket
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky/10 text-sky text-[11px] font-body font-medium uppercase tracking-wider">
            <FileText className="w-3 h-3" />
            Press Release
          </span>
          {release.embargo && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 text-[11px] font-body font-semibold uppercase tracking-wider">
              {release.embargo}
            </span>
          )}
        </div>

        {/* Title + subtitle */}
        <h3 className="font-display text-navy text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-2">
          {release.title}
        </h3>
        {release.subtitle && (
          <p className="font-body text-navy/50 text-base sm:text-lg italic leading-relaxed mb-3">
            {release.subtitle}
          </p>
        )}

        {/* Date + author */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5 font-body text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(release.date)}
          </span>
          {release.author && (
            <span className="flex items-center gap-1.5 font-body text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              {release.author}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={handleCopy}
            aria-label="Copy press release text to clipboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-navy/5 text-navy/70 text-xs font-body font-medium hover:bg-navy/10 hover:text-navy transition-colors min-h-[44px]"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy Text
          </button>
          <button
            onClick={handlePrint}
            aria-label="Print this press release"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-navy/5 text-navy/70 text-xs font-body font-medium hover:bg-navy/10 hover:text-navy transition-colors min-h-[44px]"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button
            onClick={handlePdfView}
            aria-label="Open PDF-ready view for saving"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-navy/5 text-navy/70 text-xs font-body font-medium hover:bg-navy/10 hover:text-navy transition-colors min-h-[44px]"
          >
            <FileDown className="w-3.5 h-3.5" />
            PDF View
          </button>
        </div>
      </div>

      {/* Body content */}
      <div className="px-6 sm:px-8 py-6 sm:py-8">
        {release.isPlaceholder ? (
          <PlaceholderBody title={release.title} date={release.date} />
        ) : (
          <div className="space-y-0">
            {release.blocks.map((block, bi) => (
              <ReleaseBlock key={bi} block={block} />
            ))}
          </div>
        )}
      </div>

      {/* Media contacts */}
      {release.contacts && release.contacts.length > 0 && (
        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
          <div className="border-t-2 border-navy/10 pt-5">
            <h4 className="font-display text-navy text-xs uppercase tracking-[0.15em] font-bold mb-4">
              Media Contacts
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
              {release.contacts.map((contact, ci) => (
                <div key={ci} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-sky/10 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-sky" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-navy">
                      {contact.name}
                    </p>
                    {contact.role && (
                      <p className="font-body text-xs text-navy/50">{contact.role}</p>
                    )}
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-1 font-body text-xs text-sky hover:underline mt-1"
                      >
                        <Mail className="w-3 h-3" /> {contact.email}
                      </a>
                    )}
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-1 font-body text-xs text-sky hover:underline mt-0.5"
                      >
                        <Phone className="w-3 h-3" /> {contact.phone}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ends marker */}
      <div className="border-t border-border px-6 sm:px-8 py-4 text-center">
        <span className="font-body text-xs text-navy/25 uppercase tracking-[0.2em] font-medium">
          — Ends —
        </span>
      </div>
    </motion.article>
  );
}


// ============================================================
// BLOCK RENDERER
// ============================================================

function ReleaseBlock({ block }: { block: PressReleaseBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="font-body text-sm sm:text-base text-navy/75 leading-[1.8] mb-5 whitespace-pre-line">
          {block.text}
        </p>
      );

    case 'quote':
      return (
        <blockquote className="relative my-6 ml-0 pl-5 sm:pl-6 border-l-[3px] border-sky bg-sky/[0.03] py-4 pr-5 sm:pr-6 rounded-r-lg">
          <Quote className="absolute top-3 right-4 w-8 h-8 text-sky/10" />
          <p className="font-body text-sm sm:text-base text-navy/80 leading-[1.8] italic">
            &ldquo;{block.text}&rdquo;
          </p>
          {block.attribution && (
            <footer className="mt-3 flex items-center gap-2">
              <div className="w-6 h-px bg-sky/30" />
              <cite className="font-body text-xs sm:text-sm text-navy/50 not-italic font-medium">
                {block.attribution}
              </cite>
            </footer>
          )}
        </blockquote>
      );

    case 'subheading':
      return (
        <h4 className="font-display text-navy text-sm sm:text-base uppercase tracking-[0.12em] font-bold mt-8 mb-3 pb-2 border-b border-navy/10">
          {block.text}
        </h4>
      );

    case 'note':
      return (
        <div className="flex gap-2.5 mb-4 pl-4 border-l-2 border-navy/10">
          <CheckCircle className="w-3.5 h-3.5 text-navy/25 shrink-0 mt-1" />
          <p className="font-body text-xs sm:text-sm text-navy/55 leading-relaxed">
            {block.text}
          </p>
        </div>
      );

    default:
      return null;
  }
}


// ============================================================
// PLACEHOLDER BODY (for isPlaceholder releases)
// ============================================================

function PlaceholderBody({ title, date }: { title: string; date: string }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-5">
        <FileText className="w-8 h-8 text-navy/15" />
      </div>
      <h4 className="font-display text-navy text-lg font-semibold mb-2">
        {title}
      </h4>
      <p className="font-body text-sm text-navy/40 mb-1">
        {formatDate(date)}
      </p>
      <div className="max-w-md mx-auto mt-4 space-y-3">
        {/* Skeleton lines */}
        <div className="h-3 bg-navy/5 rounded-full w-full animate-pulse" />
        <div className="h-3 bg-navy/5 rounded-full w-11/12 animate-pulse" />
        <div className="h-3 bg-navy/5 rounded-full w-10/12 animate-pulse" />
        <div className="h-3 bg-navy/5 rounded-full w-full animate-pulse" />
        <div className="h-3 bg-navy/5 rounded-full w-9/12 animate-pulse" />
      </div>
      <p className="font-body text-xs text-navy/30 mt-6 italic">
        Official press release text to be inserted here
      </p>
    </div>
  );
}


// ============================================================
// HTML HELPER (for print/PDF view)
// ============================================================

function blockToHtml(block: PressReleaseBlock): string {
  switch (block.type) {
    case 'paragraph':
      return `<p>${block.text.replace(/\n/g, '<br/>')}</p>`;
    case 'quote':
      return `<blockquote><p>"${block.text}"</p>${
        block.attribution ? `<div class="attr">— ${block.attribution}</div>` : ''
      }</blockquote>`;
    case 'subheading':
      return `<h3>${block.text}</h3>`;
    case 'note':
      return `<div class="note">${block.text}</div>`;
    default:
      return '';
  }
}
