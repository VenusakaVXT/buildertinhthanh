const fs = require('fs');
const path = require('path');

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function getDataLucideNameFromClass(classAttr) {
  if (!classAttr) return null;
  const lucideMatches = Array.from(classAttr.matchAll(/(?:^|\s)lucide-([a-z0-9-]+)/g)).map((m) => m[1]);
  if (lucideMatches.length === 0) return null;
  // Prefer names not ending with -icon if multiple are present
  const nonIcon = lucideMatches.find((n) => !n.endsWith('-icon'));
  return (nonIcon || lucideMatches[0] || '').trim();
}

function extractSize(attrs) {
  const width = /\bwidth\s*=\s*"(\d+(?:\.\d+)?)"/i.exec(attrs);
  const height = /\bheight\s*=\s*"(\d+(?:\.\d+)?)"/i.exec(attrs);
  return {
    width: width ? width[1] : null,
    height: height ? height[1] : null,
  };
}

function buildClassList(classAttr, sizeAttrs) {
  const classes = (classAttr || '').split(/\s+/).filter(Boolean);
  const keep = [];
  let wClass = null;
  let hClass = null;

  for (const cls of classes) {
    if (cls === 'lucide') continue;
    if (/^lucide-[a-z0-9-]+$/.test(cls)) continue; // drop lucide-* markers
    const wMatch = /^w-(\d+(?:\.\d+)?)$/.exec(cls);
    const hMatch = /^h-(\d+(?:\.\d+)?)$/.exec(cls);
    if (wMatch) {
      wClass = `w-${wMatch[1]}`;
      continue;
    }
    if (hMatch) {
      hClass = `h-${hMatch[1]}`;
      continue;
    }
    keep.push(cls);
  }

  // If both w- and h- exist in class, keep them; otherwise compute from attributes
  if (!(wClass && hClass)) {
    const toUnit = (px) => {
      const num = parseFloat(px);
      if (!isFinite(num)) return null;
      const unit = num / 4;
      // Trim trailing .0
      return Number.isInteger(unit) ? String(unit) : String(parseFloat(unit.toFixed(2)));
    };
    const compW = sizeAttrs && sizeAttrs.width ? toUnit(sizeAttrs.width) : null;
    const compH = sizeAttrs && sizeAttrs.height ? toUnit(sizeAttrs.height) : null;
    const fallback = '6'; // default 24px -> 6
    const nW = compW || compH || fallback;
    const nH = compH || compW || fallback;
    wClass = `w-${nW}`;
    hClass = `h-${nH}`;
  }

  // Place size first then remaining classes; de-duplicate
  const ordered = [wClass, hClass, ...keep].filter(Boolean);
  const seen = new Set();
  const deduped = [];
  for (const c of ordered) {
    if (!seen.has(c)) {
      seen.add(c);
      deduped.push(c);
    }
  }
  return deduped.join(' ').trim();
}

function convertSvgToIDataLucide(segmentHtml) {
  // Match <svg ...>...</svg> blocks that contain a lucide class
  const svgRegex = /<svg\b([^>]*)>([\s\S]*?)<\/svg>/gi;
  return segmentHtml.replace(svgRegex, (full, attrs) => {
    const classMatch = /\bclass\s*=\s*"([^"]*)"/i.exec(attrs);
    const classAttr = classMatch ? classMatch[1] : '';
    if (!/\blucide\b/.test(classAttr)) {
      // Not a lucide svg; leave untouched
      return full;
    }

    const iconName = getDataLucideNameFromClass(classAttr);
    if (!iconName) {
      return full; // cannot determine icon
    }

    const size = extractSize(attrs);
    const classList = buildClassList(classAttr, size);
    const classAttrOut = classList ? ` class="${classList}"` : '';
    return `<i data-lucide="${iconName}"${classAttrOut}></i>`;
  });
}

function convertRangeInFile(filePath, startLineNum, endLineNum) {
  const raw = readFile(filePath);
  const lines = raw.split(/\r?\n/);
  const total = lines.length;
  const startIdx = Math.max(1, parseInt(startLineNum, 10));
  const endIdx = Math.min(total, parseInt(endLineNum, 10));
  if (Number.isNaN(startIdx) || Number.isNaN(endIdx) || startIdx > endIdx) {
    throw new Error('Invalid line range');
  }

  const before = lines.slice(0, startIdx - 1).join('\n');
  const target = lines.slice(startIdx - 1, endIdx).join('\n');
  const after = lines.slice(endIdx).join('\n');

  const converted = convertSvgToIDataLucide(target);
  const out = [before, converted, after].filter((s) => s.length > 0).join('\n');
  writeFile(filePath, out);
}

function main() {
  const fileArg = process.argv[2] || 'index.html';
  const startArg = process.argv[3] || '2886';
  const endArg = process.argv[4] || '10390';
  const filePath = path.resolve(process.cwd(), fileArg);
  convertRangeInFile(filePath, startArg, endArg);
  console.log(`Converted lucide svgs to <i data-lucide> in ${path.basename(filePath)} lines ${startArg}-${endArg}`);
}

if (require.main === module) {
  main();
}