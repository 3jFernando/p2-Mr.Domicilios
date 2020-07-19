export default function FORMAT_CURRENCEY(value) {
  return '$ ' + value;
}


/*

export default function FORMAT_CURRENCEY(number) {
  const formatNumber = Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'COL',
  });
  return formatNumber.format(number);
}


*/