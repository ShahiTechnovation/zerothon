# FrontZero vs ZEROTHON: Quick Reference

## Package Manager Conversion

### Converting from pnpm to npm

| pnpm Command | npm Equivalent |
|--------------|----------------|
| `pnpm install` | `npm install` |
| `pnpm add <package>` | `npm install <package>` |
| `pnpm remove <package>` | `npm uninstall <package>` |
| `pnpm run dev` | `npm run dev` |
| `pnpm run build` | `npm run build` |

### Lock Files
- **FrontZero**: `pnpm-lock.yaml` ❌ Delete this
- **ZEROTHON**: `package-lock.json` ✅ Keep this

---

## Framework Comparison

| Feature | FrontZero | ZEROTHON | Compatible? |
|---------|-----------|----------|-------------|
| **Framework** | Remix 2.15 | Next.js 14 | ❌ No |
| **Routing** | File-based (Remix) | App Router | ❌ No |
| **Styling** | UnoCSS | Tailwind CSS | ❌ No |
| **Build Tool** | Vite | Next.js | ❌ No |
| **Deployment** | Cloudflare | Vercel | ❌ No |
| **Package Manager** | pnpm | npm | ⚠️ Can convert |
| **React Version** | 18.3.1 | 18.2.0 | ✅ Yes |
| **TypeScript** | 5.7.2 | 5.x | ✅ Yes |

---

## Dependencies Comparison

### AI & LLM Providers

| Package | FrontZero | ZEROTHON | Status |
|---------|-----------|----------|--------|
| `ai` | 4.0.13 | 6.0.3 | ⚠️ Different versions |
| `@ai-sdk/openai` | 0.0.66 | ❌ | ➕ Need to add |
| `@ai-sdk/anthropic` | 0.0.39 | ❌ | ➕ Need to add |
| `@ai-sdk/google` | 0.0.52 | ❌ | ➕ Need to add |
| `@openrouter/ai-sdk-provider` | 0.0.5 | 1.2.2 | ⚠️ Different versions |

### UI Components

| Package | FrontZero | ZEROTHON | Status |
|---------|-----------|----------|--------|
| `@radix-ui/react-dialog` | 1.1.2 | latest | ✅ Compatible |
| `@radix-ui/react-dropdown-menu` | 2.1.2 | 2.1.4 | ✅ Compatible |
| `@radix-ui/react-separator` | 1.1.0 | 1.1.1 | ✅ Compatible |
| `@radix-ui/react-switch` | 1.1.1 | 1.1.2 | ✅ Compatible |
| `@radix-ui/react-tooltip` | 1.1.4 | latest | ✅ Compatible |

### Code Editor

| Package | FrontZero | ZEROTHON | Status |
|---------|-----------|----------|--------|
| `@codemirror/state` | 6.4.1 | ❌ | ➕ Need to add |
| `@codemirror/view` | 6.35.0 | ❌ | ➕ Need to add |
| `@codemirror/lang-javascript` | 6.2.2 | ❌ | ➕ Need to add |
| `@codemirror/lang-python` | 6.1.6 | ❌ | ➕ Need to add |
| `@monaco-editor/react` | ❌ | latest | ℹ️ Already have alternative |

### Terminal

| Package | FrontZero | ZEROTHON | Status |
|---------|-----------|----------|--------|
| `@xterm/xterm` | 5.5.0 | ❌ | ➕ Need to add |
| `@xterm/addon-fit` | 0.10.0 | ❌ | ➕ Need to add |
| `@xterm/addon-web-links` | 0.11.0 | ❌ | ➕ Need to add |

### WebContainer & Git

| Package | FrontZero | ZEROTHON | Status |
|---------|-----------|----------|--------|
| `@webcontainer/api` | 1.3.0-internal.10 | ❌ | ➕ Need to add |
| `isomorphic-git` | 1.27.2 | ❌ | ➕ Need to add |

### Utilities

| Package | FrontZero | ZEROTHON | Status |
|---------|-----------|----------|--------|
| `framer-motion` | 11.12.0 | latest | ✅ Already have |
| `react-resizable-panels` | 2.1.7 | 2.1.9 | ✅ Already have |
| `jszip` | 3.10.1 | latest | ✅ Already have |
| `date-fns` | 3.6.0 | 4.1.0 | ✅ Already have |
| `zod` | 3.23.8 | 3.25.76 | ✅ Already have |
| `file-saver` | 2.0.5 | ❌ | ➕ Need to add |
| `diff` | 5.2.0 | ❌ | ➕ Need to add |
| `nanostores` | 0.10.3 | ❌ | ➕ Need to add |
| `@nanostores/react` | 0.7.3 | ❌ | ➕ Need to add |

### Markdown & Syntax Highlighting

| Package | FrontZero | ZEROTHON | Status |
|---------|-----------|----------|--------|
| `react-markdown` | 9.0.1 | ❌ | ➕ Need to add |
| `remark-gfm` | 4.0.0 | ❌ | ➕ Need to add |
| `rehype-raw` | 7.0.0 | ❌ | ➕ Need to add |
| `rehype-sanitize` | 6.0.0 | ❌ | ➕ Need to add |
| `shiki` | 1.24.0 | ❌ | ➕ Need to add |

---

## Installation Commands

### Packages to Add to ZEROTHON

```bash
# Core IDE functionality
npm install @webcontainer/api

# Terminal emulator
npm install @xterm/xterm @xterm/addon-fit @xterm/addon-web-links

# Code editor (CodeMirror)
npm install @codemirror/state @codemirror/view @codemirror/commands
npm install @codemirror/autocomplete @codemirror/search @codemirror/language
npm install @codemirror/lang-javascript @codemirror/lang-python
npm install @codemirror/lang-css @codemirror/lang-html @codemirror/lang-json
npm install @codemirror/lang-markdown
npm install @uiw/codemirror-theme-vscode @lezer/highlight

# Git functionality
npm install isomorphic-git

# Utilities
npm install file-saver diff nanostores @nanostores/react

# Markdown rendering
npm install react-markdown remark-gfm rehype-raw rehype-sanitize

# Syntax highlighting
npm install shiki

# Additional AI providers (optional)
npm install @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google @ai-sdk/mistral
```

### Total Size Impact
- **Estimated additional size**: ~50-60 MB in node_modules
- **Bundle size increase**: ~2-3 MB (with code splitting)

---

## File Structure Mapping

### FrontZero → ZEROTHON

```
FrontZero/                          ZEROTHON/
├── app/                            ├── app/
│   ├── routes/                     │   ├── ide/
│   │   ├── _index.tsx         →    │   │   └── page.tsx
│   │   ├── chat.$id.tsx       →    │   │   └── chat/[id]/page.tsx
│   │   └── api.*.ts           →    │   └── api/ide/*/route.ts
│   ├── components/                 ├── components/ide/
│   │   ├── chat/              →    │   ├── chat/
│   │   ├── editor/            →    │   ├── editor/
│   │   ├── workbench/         →    │   ├── workbench/
│   │   └── ui/                →    │   └── ui/ (merge)
│   ├── lib/                        ├── lib/ide/
│   │   ├── webcontainer/      →    │   ├── webcontainer/
│   │   ├── stores/            →    │   ├── stores/
│   │   └── modules/           →    │   └── modules/
│   └── utils/                      └── utils/ (merge)
├── vite.config.ts             ❌   (Don't copy - Next.js handles this)
├── remix.config.js            ❌   (Don't copy - Remix specific)
├── package.json               ⚠️   (Merge dependencies only)
└── pnpm-lock.yaml             ❌   (Don't copy - use npm)
```

---

## Code Pattern Conversions

### 1. Route Handlers

**FrontZero (Remix):**
```typescript
// app/routes/api.chat.ts
import { json } from '@remix-run/cloudflare';

export const action = async ({ request }) => {
  const data = await request.json();
  return json({ result: 'ok' });
};
```

**ZEROTHON (Next.js):**
```typescript
// app/api/ide/chat/route.ts
export async function POST(request: Request) {
  const data = await request.json();
  return Response.json({ result: 'ok' });
}
```

### 2. Data Loading

**FrontZero (Remix):**
```typescript
import { useLoaderData } from '@remix-run/react';

export const loader = async () => {
  return json({ data: 'value' });
};

export default function Component() {
  const data = useLoaderData();
  return <div>{data.data}</div>;
}
```

**ZEROTHON (Next.js):**
```typescript
// Server Component
async function getData() {
  return { data: 'value' };
}

export default async function Component() {
  const data = await getData();
  return <div>{data.data}</div>;
}

// OR Client Component
'use client';
import { useState, useEffect } from 'react';

export default function Component() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);
  
  return <div>{data?.data}</div>;
}
```

### 3. Client-Only Components

**FrontZero (Remix):**
```typescript
import { ClientOnly } from 'remix-utils/client-only';

export default function Page() {
  return (
    <ClientOnly fallback={<Loading />}>
      {() => <InteractiveComponent />}
    </ClientOnly>
  );
}
```

**ZEROTHON (Next.js):**
```typescript
import dynamic from 'next/dynamic';

const InteractiveComponent = dynamic(
  () => import('./InteractiveComponent'),
  { ssr: false, loading: () => <Loading /> }
);

export default function Page() {
  return <InteractiveComponent />;
}
```

### 4. Styling

**FrontZero (UnoCSS):**
```typescript
<div className="flex flex-col h-full w-full bg-bolt-elements-background-depth-1">
  <button className="i-ph:chat-circle text-bolt-elements-textPrimary">
    Chat
  </button>
</div>
```

**ZEROTHON (Tailwind + Lucide):**
```typescript
import { MessageCircle } from 'lucide-react';

<div className="flex flex-col h-full w-full bg-gray-900">
  <button className="flex items-center gap-2 text-gray-100">
    <MessageCircle className="w-5 h-5" />
    Chat
  </button>
</div>
```

### 5. Environment Variables

**FrontZero:**
```typescript
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
```

**ZEROTHON:**
```typescript
// Client-side
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

// Server-side
const apiKey = process.env.OPENAI_API_KEY;
```

---

## Testing Checklist

### Before Integration
- [ ] Current ZEROTHON project builds successfully
- [ ] All existing features work
- [ ] Git is clean (commit current work)

### During Integration
- [ ] Dependencies installed without conflicts
- [ ] TypeScript compiles without errors
- [ ] No duplicate dependencies
- [ ] Environment variables configured

### After Integration
- [ ] IDE page loads at `/ide`
- [ ] Chat functionality works
- [ ] Code editor renders
- [ ] Terminal executes commands
- [ ] WebContainer initializes
- [ ] No console errors
- [ ] Existing features still work
- [ ] Build succeeds: `npm run build`

---

## Troubleshooting

### Issue: "Cannot find module '@remix-run/react'"
**Solution**: You copied Remix-specific code. Remove all `@remix-run` imports.

### Issue: "className 'i-ph:*' not found"
**Solution**: Replace UnoCSS icon classes with Lucide React icons.

### Issue: "useLoaderData is not defined"
**Solution**: Convert to Next.js data fetching patterns (see above).

### Issue: "SharedArrayBuffer is not defined"
**Solution**: Add headers to `next.config.mjs`:
```javascript
async headers() {
  return [
    {
      source: '/ide',
      headers: [
        { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      ],
    },
  ];
}
```

### Issue: Package conflicts
**Solution**: Delete `node_modules` and `package-lock.json`, then `npm install`

---

## Performance Considerations

### Bundle Size Impact

| Feature | Size Impact | Mitigation |
|---------|-------------|------------|
| WebContainer | ~500 KB | Lazy load on IDE page only |
| CodeMirror | ~300 KB | Dynamic import |
| Xterm | ~200 KB | Dynamic import |
| AI SDK | ~100 KB | Already have |
| **Total** | **~1.1 MB** | Use code splitting |

### Optimization Strategies

```typescript
// 1. Dynamic imports
const CodeEditor = dynamic(() => import('@/components/ide/editor/CodeEditor'), {
  ssr: false,
  loading: () => <Skeleton />
});

// 2. Route-based code splitting (automatic in Next.js)
// IDE code only loads when visiting /ide

// 3. Lazy load WebContainer
const [webcontainer, setWebcontainer] = useState(null);

useEffect(() => {
  import('@webcontainer/api').then(({ WebContainer }) => {
    WebContainer.boot().then(setWebcontainer);
  });
}, []);
```

---

## Security Considerations

### Environment Variables
- ✅ Use `NEXT_PUBLIC_*` for client-side only
- ✅ Keep API keys server-side
- ❌ Never expose secret keys to client

### WebContainer Sandboxing
- ✅ WebContainer runs in isolated environment
- ✅ No access to user's file system
- ⚠️ Still validate all user input

### API Routes
- ✅ Add rate limiting
- ✅ Validate requests
- ✅ Sanitize AI responses

---

## Deployment Considerations

### Vercel Configuration

Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/ide(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        },
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        }
      ]
    }
  ]
}
```

### Environment Variables on Vercel
```bash
# Add these in Vercel dashboard
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
```

---

## Summary

### ✅ Can Use Directly
- React components (with modifications)
- UI logic and patterns
- Utility functions
- Type definitions

### ⚠️ Need Conversion
- Route handlers (Remix → Next.js)
- Data loading (loaders → fetch/server components)
- Styling (UnoCSS → Tailwind)
- Environment variables (VITE_ → NEXT_PUBLIC_)

### ❌ Cannot Use
- Remix-specific files
- Vite configuration
- Cloudflare Workers code
- pnpm lock file

---

**Need help with a specific component?** Let me know which part you want to implement first!
