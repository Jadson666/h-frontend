export const filterRecord = ({
  keywords,
  keyFilter,
  source,
  sourceFilter
}: {
  keywords: string[];
  source: string;
  sourceFilter: string;
  keyFilter: string;
}) => {
  const keyRegex = new RegExp(keyFilter, 'i')
  const sourceRegex = new RegExp(sourceFilter, 'i')
  if (!sourceFilter && !keyFilter) return true;
  if (sourceFilter && sourceRegex.test(source)) return true;
  if (keyFilter && keywords.some((word) => keyRegex.test(word))) {
    return true;
  }
  return false;
};
