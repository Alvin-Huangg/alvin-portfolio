'use client'

/**
 * Hand-drawn DJ doodle — loose single-line ink style.
 * A figure leaning over a turntable: the record spins, the head bobs,
 * and music notes float up when `active` (music playing).
 * Rendered as a faint background layer inside the Spotify widget.
 */
export default function DJDoodle({ active = false }: { active?: boolean }) {
  // Spin faster + bob + emit notes when music is playing; idle-drift when not.
  const discDur = active ? '2.6s' : '14s'

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[150%] opacity-[0.22] dark:opacity-[0.3] text-accent"
    >
      {/* key remounts SMIL timelines cleanly when play-state flips */}
      <svg
        key={active ? 'on' : 'off'}
        viewBox="0 0 130 92"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-full w-auto"
      >
        {/* ground line */}
        <path d="M8 80 C32 83 64 83 86 79" opacity="0.5" />

        {/* ── TURNTABLE ── */}
        {/* platter (hand-drawn wobble, slightly open) */}
        <path d="M62 50 C62 63 51 75 38 75 C25 75 13 64 13 51 C13 38 25 27 38 27 C50 27 61 37 62 49" />

        {/* spinning record group */}
        <g>
          <circle cx="38" cy="51" r="6.5" />
          <circle cx="38" cy="51" r="1" fill="currentColor" stroke="none" />
          {/* radial groove ticks so the spin reads */}
          <path d="M38 44.5 L38 31" opacity="0.7" />
          <path d="M44.5 51 L57 51" opacity="0.45" />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 38 51"
            to="360 38 51"
            dur={discDur}
            repeatCount="indefinite"
          />
        </g>

        {/* tonearm */}
        <path d="M60 31 C57 35 50 44 44 49" opacity="0.7" />
        <circle cx="60" cy="31" r="1.6" fill="currentColor" stroke="none" opacity="0.7" />

        {/* ── DJ FIGURE ── */}
        <g>
          {/* head + cap brim */}
          <path d="M81 27 C81 21 86 17 91 18 C96 19 98 24 96 29 C94 33 89 34 85 31" />
          <path d="M80 26 C84 23 92 22 97 25" opacity="0.85" />
          {/* headphone band + ear pad */}
          <path d="M81 24 C82 17 96 17 97 24" opacity="0.8" />
          <path d="M80 25 C78 26 78 30 81 31" opacity="0.8" />
          {/* torso leaning toward the decks */}
          <path d="M90 33 C92 44 91 56 88 67" />
          {/* arm reaching down to the record */}
          <path d="M86 38 C76 42 63 48 52 51" />
          {/* back leg / stance */}
          <path d="M88 67 C86 72 84 76 84 80" opacity="0.85" />
          <path d="M89 67 C92 72 93 76 94 80" opacity="0.85" />
          {/* gentle head + torso bob */}
          {active && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="-3 89 40; 3 89 40; -3 89 40"
              dur="1.15s"
              repeatCount="indefinite"
            />
          )}
        </g>

        {/* ── MUSIC NOTES (only while playing) ── */}
        {active && (
          <>
            <g opacity="0">
              <path d="M50 40 L50 30 C53 31 55 33 53 36" />
              <circle cx="48.5" cy="40.5" r="1.9" fill="currentColor" stroke="none" />
              <animateTransform attributeName="transform" type="translate" from="0 0" to="-5 -24" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.95;0" dur="2.4s" repeatCount="indefinite" />
            </g>
            <g opacity="0">
              <path d="M60 36 L60 27 C63 28 64 30 62 33" />
              <circle cx="58.5" cy="36.5" r="1.7" fill="currentColor" stroke="none" />
              <animateTransform attributeName="transform" type="translate" from="0 0" to="4 -22" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.95;0" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
            </g>
          </>
        )}
      </svg>
    </div>
  )
}
