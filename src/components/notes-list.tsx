"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { CMSTechNote, getDisplayDate } from "@/lib/cms";
import { formatDate } from "@/lib/utils";

interface NotesListProps {
  notes: CMSTechNote[];
}

export function NotesList({ notes }: NotesListProps) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? notes.filter((n) =>
        n.Title.toLowerCase().includes(query.toLowerCase())
      )
    : notes;

  return (
    <>
      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="> SEARCH_NOTES..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-none border border-accent/30 bg-transparent text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results */}
      <div className="grid gap-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-mono">
              {query ? `No notes matching "${query}"` : "No notes available yet."}
            </p>
          </div>
        ) : (
          filtered.map((note, index) => (
            <Link
              key={note.documentId}
              href={`/notes/${note.documentId}`}
              className="group block px-4 py-4 border border-border border-l-2 border-l-border hover:border-l-accent hover:border-accent/40 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="term-idx shrink-0 mt-0.5">
                    [{(index + 1).toString().padStart(3, '0')}]
                  </span>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity shrink-0 font-mono text-sm">
                      {">"}
                    </span>
                    <h3 className="text-base font-mono font-medium group-hover:text-accent transition-colors truncate">
                      {note.Title}
                    </h3>
                  </div>
                </div>
                <div className="pl-10 sm:pl-0 shrink-0">
                  {getDisplayDate(note) ? (
                    <time
                      dateTime={getDisplayDate(note)!}
                      className="text-xs font-mono text-muted-foreground tabular-nums"
                    >
                      {formatDate(getDisplayDate(note)!)}
                    </time>
                  ) : (
                    <span className="text-xs font-mono text-muted-foreground/50">
                      —
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {query && filtered.length > 0 && (
        <p className="mt-4 text-xs font-mono text-muted-foreground">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
        </p>
      )}
    </>
  );
}
