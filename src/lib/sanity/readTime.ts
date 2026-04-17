// Calculate read time based on Sanity Portable Text
export function calculateReadTime(blocks: any[]): number {
  if (!blocks || !Array.isArray(blocks)) return 1;
  const text = blocks
    .filter((block) => block._type === 'block' && block.children)
    .map((block) => block.children.map((child: { text: string }) => child.text).join(''))
    .join(' ');
  
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
