import type { Contact } from "@/lib/domain/contact";
import { MOCK_CONTACTS_BATCH_A } from "@/lib/data/mocks/contacts-batch-a.mock";
import { MOCK_CONTACTS_BATCH_B } from "@/lib/data/mocks/contacts-batch-b.mock";

/** All mock contacts — covers the 8 pipeline statuses. */
export const MOCK_CONTACTS: readonly Contact[] = [
  ...MOCK_CONTACTS_BATCH_A,
  ...MOCK_CONTACTS_BATCH_B,
];
