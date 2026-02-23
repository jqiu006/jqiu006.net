import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import React from 'react';
import { CodeBlock } from '@/components/code-block';

interface MDXContentProps {
  source: string;
}

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|avi|mkv|ogv)(\?.*)?$/i;

interface AnchorProps {
  href?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

function MDXAnchor({ href, children, ...rest }: AnchorProps) {
  if (href && VIDEO_EXTENSIONS.test(href)) {
    return (
      <span className="block my-6 not-prose">
        <video
          controls
          preload="metadata"
          className="w-full rounded-lg bg-black max-h-[70vh]"
        >
          <source src={href} />
          Your browser does not support video playback.
        </video>
      </span>
    );
  }
  return (
    <a href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
      {children}
    </a>
  );
}

const mdxComponents = {
  a: MDXAnchor,
  pre: CodeBlock,
};

const prettyCodeOptions = {
  theme: {
    dark: 'github-dark',
    light: 'github-light',
  },
  keepBackground: false,
  defaultLang: 'plaintext',
};

export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              [rehypePrettyCode, prettyCodeOptions],
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: 'wrap',
                  properties: {
                    className: ['anchor'],
                  },
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}

export function generateTableOfContents(content: string): Array<{
  id: string;
  title: string;
  level: number;
}> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: Array<{ id: string; title: string; level: number }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    toc.push({ id, title, level });
  }

  return toc;
}
