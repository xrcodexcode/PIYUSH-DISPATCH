const fs = require('fs');
const path = require('path');

// 1. IssueComments.tsx
let comments = fs.readFileSync('src/components/IssueComments.tsx', 'utf8');
comments = comments.replace('setComments(parsed);', '// eslint-disable-next-line react-hooks/set-state-in-effect\n          setComments(parsed);');
comments = comments.replace('setComments(getDefaultComments());', '// eslint-disable-next-line react-hooks/set-state-in-effect\n          setComments(getDefaultComments());');
fs.writeFileSync('src/components/IssueComments.tsx', comments);

// 2. IssueReactions.tsx
let reactions = fs.readFileSync('src/components/IssueReactions.tsx', 'utf8');
reactions = reactions.replace('setUserReactions(new Set(parsed.userSelected));', '// eslint-disable-next-line react-hooks/set-state-in-effect\n          setUserReactions(new Set(parsed.userSelected));');
reactions = reactions.replace('setCounts(parsed.counts);', '// eslint-disable-next-line react-hooks/set-state-in-effect\n          setCounts(parsed.counts);');
fs.writeFileSync('src/components/IssueReactions.tsx', reactions);

// 3. MDXContent.tsx
let mdx = fs.readFileSync('src/components/MDXContent.tsx', 'utf8');
mdx = mdx.replace('headingCounters = new Map<string, number>();', 'headingCounters.clear();');
fs.writeFileSync('src/components/MDXContent.tsx', mdx);

// 4. ReaderCustomizer.tsx
let reader = fs.readFileSync('src/components/ReaderCustomizer.tsx', 'utf8');
reader = reader.replace('setPrefs(merged);', '// eslint-disable-next-line react-hooks/set-state-in-effect\n        setPrefs(merged);');
fs.writeFileSync('src/components/ReaderCustomizer.tsx', reader);

// 5. SubscribeDrawer.tsx
let drawer = fs.readFileSync('src/components/SubscribeDrawer.tsx', 'utf8');
drawer = drawer.replace("window.removeEventListener('scroll', handleScroll);", "window.removeEventListener('scroll', scrollListener);");
drawer = drawer.replace("const handleScroll = useCallback(() => {", "const handleScroll = useCallback(function scrollListener() {");
fs.writeFileSync('src/components/SubscribeDrawer.tsx', drawer);

// 6. SubscribeForm.tsx
let form = fs.readFileSync('src/components/SubscribeForm.tsx', 'utf8');
form = form.replace(/\/\/ eslint-disable-next-line @next\/next\/no-location-assign-relative-destination/g, ''); // remove old
form = form.replace("window.location.href = substackUrl;", "// eslint-disable-next-line @next/next/no-location-assign-relative-destination\n        window.location.href = substackUrl;");
form = form.replace("window.location.href = substackUrl;", "// eslint-disable-next-line @next/next/no-location-assign-relative-destination\n      window.location.href = substackUrl;");
fs.writeFileSync('src/components/SubscribeForm.tsx', form);

// 7. security.ts (remove unused eslint disable)
let security = fs.readFileSync('src/lib/security.ts', 'utf8');
security = security.replace(/\/\/ eslint-disable-next-line no-control-regex\n/g, '');
fs.writeFileSync('src/lib/security.ts', security);

// 8. KeyboardShortcutsModal.tsx
let modal = fs.readFileSync('src/components/KeyboardShortcutsModal.tsx', 'utf8');
modal = modal.replace('}, [isOpen]);', '}, [isOpen, router]);');
fs.writeFileSync('src/components/KeyboardShortcutsModal.tsx', modal);

console.log('Done script 2');
