export const getEnumValueByName = <T>(
  enumType: T,
  name: string
): T[keyof T] | undefined => enumType[name as keyof T];

export const enumToIdNameArray = <T extends object>(
  enumObj: T
): { id: number; name: string }[] =>
  Object.keys(enumObj)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      id: enumObj[key as keyof T] as unknown as number,
      name: formatEnumKey(key),
    }));

export const formatEnumKey = (key: string): string => {
  return key
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
