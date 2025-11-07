
export const parseTimeString = (timeString: string): Date => {
  const now = Date.now();
  const regex = /^(\d+)([mhd])$/;
  const match = timeString.match(regex);

  if (!match) {
    throw new Error(`Invalid time format: ${timeString}. Use format like '5m', '2h', '1d'`);
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 'm': // minutes
      return new Date(now + value * 60 * 1000);
    case 'h': // hours
      return new Date(now + value * 60 * 60 * 1000);
    case 'd': // days
      return new Date(now + value * 24 * 60 * 60 * 1000);
    default:
      throw new Error(`Unknown time unit: ${unit}`);
  }
}