export function parseDecimal(value: string): number {
  return parseFloat(
    value.replaceAll(
      ',',
      '.'
    )
  );
}
