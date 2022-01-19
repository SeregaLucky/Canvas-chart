export const toDate = time => {
  const shortMounths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const date = new Date(time);
  return `${shortMounths[date.getMonth()]} ${date.getDate()}`;
};
