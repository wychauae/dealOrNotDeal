interface CurrencyAmountProps {
  children: string;
  className?: string;
  title?: string;
}

/** Renders a currency string without wrapping between $ and digits */
export function CurrencyAmount({
  children,
  className,
  title,
}: CurrencyAmountProps) {
  return (
    <span
      className={['currencyAmount', className].filter(Boolean).join(' ')}
      title={title}
    >
      {children}
    </span>
  );
}
