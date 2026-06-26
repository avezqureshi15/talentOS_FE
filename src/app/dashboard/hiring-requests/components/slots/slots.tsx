import { useState } from "react";
import AccordionCard from "@/components/shared/accordion-card/accordion-card";
import { MOCK_INTERVIEWERS, SLOTS_LABELS } from "./slots-card.constants";

const Slots = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  if (MOCK_INTERVIEWERS.length === 0) {
    return <div className="hr-tab-placeholder">{SLOTS_LABELS.NO_SLOTS}</div>;
  }

  return (
    <div className="accordion-list">
      {MOCK_INTERVIEWERS.map((i) => (
        <AccordionCard
          key={i.id}
          id={i.id}
          name={i.name}
          email={i.email}
          contactNumber={i.contactNumber}
          linkHref={i.slotLink}
          linkLabel={SLOTS_LABELS.SLOT_LINK}
          isOpen={openId === i.id}
          onToggleOpen={(id) => setOpenId(openId === id ? null : id)}
          jdHref={i.jdHref}
          jdLabel={SLOTS_LABELS.JD}
        />
      ))}
    </div>
  );
};

export default Slots;
