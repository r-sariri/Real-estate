import type { InquiryMode, Property } from '../../data/types';
import { InquiryForm } from '../forms/InquiryForm';
import { Modal } from '../ui/Modal';
import { formatPrice } from '../../data/properties';

type InquiryModalProps = {
  open: boolean;
  mode: InquiryMode;
  property?: Property;
  onClose: () => void;
};

export function InquiryModal({ open, mode, property, onClose }: InquiryModalProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="inquiry-title">
      <span className="eyebrow">{mode === 'viewing' ? 'Schedule a Viewing' : 'Contact Agent'}</span>
      <h2 id="inquiry-title" className="inquiry-modal__title">
        {property ? property.name : mode === 'viewing' ? 'Book a private viewing' : 'Speak with an advisor'}
      </h2>
      {property ? (
        <p className="inquiry-modal__sub">
          {formatPrice(property.price)} · {property.city}, {property.region}
        </p>
      ) : (
        <p className="inquiry-modal__sub">Tell us what you are looking for and an advisor will respond personally.</p>
      )}
      <InquiryForm mode={mode} property={property} onDone={onClose} />
    </Modal>
  );
}
