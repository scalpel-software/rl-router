export default function stringifyHref(href, basename) {
  if (typeof href === 'string') { return `${basename || ''}${href}`; }

  return `${basename || ''}${href.pathname}${href.search || ''}`;
};
