import './Linkify.css'

const URL_PATTERN = /(https?:\/\/[^\s]+)/g

// Renders plain text with any http(s) URLs in it turned into real links,
// so pasting a link into a todo or a reading-list task/notes field makes it
// clickable without needing a separate "link" field like Study Ledger has.
export default function Linkify({ text }) {
  if (!text) return null
  return text.split(URL_PATTERN).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        className="linkify-url"
        href={part}
        target="_blank"
        rel="noreferrer"
        draggable={false}
        onClick={(e) => e.stopPropagation()}
      >
        {part}
      </a>
    ) : (
      part
    ),
  )
}
