export const formatPrice = (number, currency) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency ? currency : 'USD'
  }).format(number);
