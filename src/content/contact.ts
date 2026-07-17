export type ContactChannel = {
  label: string;
  value: string;
  href: string;
  external: boolean;
};

export const contactChannels: readonly ContactChannel[] = [
  {
    label: "Email",
    value: "vaneetveldemichiel@gmail.com",
    href: "mailto:vaneetveldemichiel@gmail.com",
    external: false,
  },
  {
    label: "LinkedIn",
    value: "Michiel Van Eetvelde",
    href: "https://www.linkedin.com/in/michiel-van-eetvelde-03649b163/",
    external: true,
  },
  {
    label: "GitHub",
    value: "michvane",
    href: "https://github.com/michvane",
    external: true,
  },
];

export const contactLocation = {
  region: "Based around Ghent, Belgium.",
  timezone: "Central European Time · UTC+1, UTC+2 in summer",
  privacyNote:
    "Who really knows where Belgium is? Drawn from memory. Maybe just use Google Maps instead..",
};
