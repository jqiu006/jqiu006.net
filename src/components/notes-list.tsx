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
          placeholder="Search notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-colors"
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
      <div className="grid gap-6">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {query ? `No notes matching "${query}"` : "No notes available yet."}
            </p>
          </div>
        ) : (
          filtered.map((note) => (
            <Link
              key={note.documentId}
              href={`/notes/${note.documentId}`}
              className="group block p-6 border border-border rounded-lg hover:border-accent/50 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                    {note.Title}
                  </h3>
                  {getDisplayDate(note) ? (
                    <time
                      dateTime={getDisplayDate(note)!}
                      className="text-sm text-muted-foreground"
                    >
                      {formatDate(getDisplayDate(note)!)}
                    </time>
                  ) : (
                    <span className="text-sm text-muted-foreground/50 italic">
                      No date
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {query && filtered.length > 0 && (
        <p className="mt-4 text-xs text-muted-foreground">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
        </p>
      )}
    </>
  );
}
