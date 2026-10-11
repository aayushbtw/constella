// Worst cases from the break-ui catalog: each one a real naming pattern or a real limit.

const datasets = ["demo", "worst", "empty", "one", "huge"] as const;

type Dataset = (typeof datasets)[number];

const datasetLabels = {
  demo: "Demo data",
  empty: "Empty",
  huge: "1,000 rows",
  one: "One",
  worst: "Worst case",
} satisfies Record<Dataset, string>;

interface Person {
  email: string;
  initials: string;
  name: string;
  src?: string;
}

// A wide strip, to check the avatar crops rather than squashes.
const panorama = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="4000" height="200"><rect width="4000" height="200" fill="#3b82f6"/><rect x="1900" width="200" height="200" fill="#f59e0b"/></svg>'
)}`;

const demoPeople: Person[] = [
  {
    email: "shadcn@acme.com",
    initials: "CN",
    name: "shadcn",
    src: "/avatars/shadcn.png",
  },
  {
    email: "emilkowalski@acme.com",
    initials: "EK",
    name: "emilkowalski",
    src: "/avatars/emilkowalski.png",
  },
  {
    email: "evilrabbit@acme.com",
    initials: "ER",
    name: "evilrabbit",
    src: "/avatars/evilrabbit.png",
  },
];

const worstPeople: Person[] = [
  {
    email: "bartholomew.fitzgerald-worthington.accounts-payable@acme.com",
    initials: "AW",
    name: "Aleksandra Wiśniewska-Kowalczyk",
    src: "/break/missing-avatar.png",
  },
  { email: "a@b.co", initials: "J", name: "Jo" },
  {
    email: "first.last+billing-notifications@acme.com",
    initials: "CAM",
    name: "Christopher Alexander Montgomery III",
    src: panorama,
  },
  { email: "wang.xiuying@acme.com", initials: "王", name: "王秀英" },
  { email: "fox@acme.com", initials: "🦊", name: "🦊 Fox" },
  {
    email: "hanh.dang@acme.com",
    initials: "ĐH",
    name: "Đặng Thị Ngọc Hân",
  },
  {
    email: "nour@acme.com",
    initials: "نع",
    name: "نور الهدى عبد الرحمن",
  },
];

const firstNames = [
  "Aleksandra",
  "Jo",
  "Christopher",
  "Seán",
  "María José",
  "Konstantin",
  "Priya",
  "Ólafur",
];

const hugePeople: Person[] = Array.from({ length: 1284 }, (_, index) => {
  const name = `${firstNames[index % firstNames.length]} ${index + 1}`;
  return {
    email: `member-${index + 1}@acme.com`,
    initials: name.slice(0, 1),
    name,
  };
});

function peopleFor(data: Dataset) {
  return {
    demo: demoPeople,
    empty: [],
    huge: hugePeople,
    one: demoPeople.slice(0, 1),
    worst: worstPeople,
  }[data];
}

const text = {
  description2000: Array.from(
    { length: 14 },
    () =>
      "Pasted from the onboarding doc: please review the vendor contract before Friday, flag anything that conflicts with the data processing addendum, and loop in legal if the indemnity cap changed."
  ).join(" "),
  file: "Q3 Board Deck — FINAL (revised) v12 [approved by legal].pdf",
  french: "Paramètres de confidentialité et de sécurité",
  german: "Benachrichtigungseinstellungen",
  jobTitle: "Senior Product Design Engineer, Platform Infrastructure",
  markup: "<script>alert(1)</script> &amp; **bold**",
  status: "Invitation expired 12 days ago",
  tag: "customer-feedback-from-enterprise-onboarding",
  url: "https://acme.com/workspaces/acme/projects/q3-launch/docs/9f8e7d6c5b4a?tab=comments&filter=unresolved",
  uuid: "9f8e7d6c-5b4a-4c3d-8e2f-1a0b9c8d7e6f",
} as const;

export { datasetLabels, datasets, peopleFor, text };
export type { Dataset, Person };
