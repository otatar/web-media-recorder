export function secToHMS(sec: number): string {
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec - hours * 3600) / 60);
  const seconds = Math.floor(sec - hours * 3600 - minutes * 60);

  return (
    ("0" + hours.toString()).slice(-2) +
    ":" +
    ("0" + minutes.toString()).slice(-2) +
    ":" +
    ("0" + seconds.toString()).slice(-2)
  );
}
